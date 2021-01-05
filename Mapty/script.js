'use strict'


const form = document.querySelector('.form');
const container = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


class Workout {
    date = new Date();
    id = (Date.now() + '').slice(-10);
    clicks = 0;

    constructor(coords, distance, duration) {
        // this.date = date;
        // this.id = id;
        this.coords = coords;   //[lat, long]
        this.distance = distance;   // in km
        this.duration = duration;   // in min
    }

    _setDescription() {
        //prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
    }

    click() {
        this.clicks++;
    }
};

class Running extends Workout {
    type = 'running';
    constructor(coords, distance, duration,cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }

    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
};

class Cycling extends Workout {
    type = 'cycling';
    constructor(coords, distance, duration, eleGain) {
        super(coords, distance, duration);
        this.eleGain = eleGain;
        // this.type = 'cycling';
        this.calcSpeed();
        this._setDescription();
    }
    calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }

}

const run = new Running([15, 69], 5.2, 24, 150);
const cycle = new Cycling([15, 69], 13, 40, 520);
// console.log(cycle, run);

//  Application Architecture.
class App {
    // private class fields to load map, mapEvent
    #map;
    #mapEvent;
    #mapZoom = 13;
    #workouts = [];

    constructor() {
        this._getPosition();

        // get data from local Storage
        this._getLS();

        //attach event handlers
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationonField.bind(this));
        container.addEventListener('click', this._moveToPopup.bind(this));
    }

    _getPosition() {
        if(navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
                alert('Could not get your positon');
            });
    };

    _loadMap(position) {
        const {latitude} = position.coords;
        const {longitude} = position.coords;
        const coords = [latitude, longitude];
        
        // console.log(`https://www.google.com/maps/@${latitude},${longitude},13z`);
    
        // the id of the html map position is entered in L.map('') & lat, lon array in setView
        this.#map = L.map('map').setView(coords, this.#mapZoom);
        // console.log(map);
    
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
    
        // handle clicks on map.
        this.#map.on('click', this._showForm.bind(this));

        this.#workouts.forEach(work => {
            this._renderMarker(work);
        });
    };

    _showForm(mapEv) {
        this.#mapEvent = mapEv;
        form.classList.remove('hidden');    //workout form shows
        inputDistance.focus();  // cursor on distance slot for quick input.
    }

    _hideForm() {
        // empty forms
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
        form.getElementsByClassName.display = 'none';
        form.classList.add('hidden');
        setTimeout(() => (form.getElementsByClassName.display = 'grid'), 1000);
    }

    _toggleElevationonField() {
        //  display either cadence/ele.gain on selecting input type
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }
    _newWorkout(e) {
        const validInputs = (...input) => 
            input.every(inp => Number.isFinite(inp));
        const allPositive = (...input) => input.every(inp => inp > 0);

        e.preventDefault();

        // Get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const {lat, lng} = this.#mapEvent.latlng;
        let workout;

        // create object based on the workout entered.
        if (type === 'running') {
            const cadence = +inputCadence.value;
            // Check data validity: +ve & numeral
            if (
                // !Number.isFinite(distance) || 
                // !Number.isFinite(duration) || 
                // !Number.isFinite(cadence)
                !validInputs(distance, duration, cadence) ||
                !allPositive(distance, duration, cadence)
            )
                return alert('Input have to be positive number');

            workout = new Running([lat, lng], distance, duration, cadence);
        }
        if (type === 'cycling') {
            const elevation = +inputElevation.value;
            // check if data positive, numeral. elev mayb -ve
            if(
                !validInputs(distance, duration, elevation) || 
                !allPositive(distance, duration)
            )
                return alert('Input have to be positive number');

            workout = new Cycling([lat, lng], distance, duration, elevation); 
        }

        // add object to workout array
        this.#workouts.push(workout);
        // console.log(workout);

        // Render the workout on map as marker
        this._renderMarker(workout);

        // render workout onto the list to display
        this._renderWorkout(workout);
    
        // clear input fields
        this._hideForm();

        // set local storage to all workouts
        this._setLS();

    }
    // marker creates a marker(pos) on map,addTo add marker to map.
    _renderMarker(workout) {
        L.marker(workout.coords).addTo(this.#map).bindPopup(L.popup({
            maxWidth: 300,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`,
        })).setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`).openPopup();
    };

    // marker creates a list to display in the sidebar
    _renderWorkout(workout) {

        let html = `
            <li class="workout workout--${workout.type}" data-id="${workout.id}">
                <h2 class="workout__title">${workout.description}</h2>
                <div class="workout__details">
                    <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
                    <span class="workout__value">${workout.distance}</span>
                    <span class="workout__unit">km</span>
                </div>

                <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${workout.duration}</span>
                    <span class="workout__unit">min</span>
                </div>
        `;
        if(workout.type === 'running') {
            html += `
                <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.pace.toFixed(1)}</span>
                    <span class="workout__unit">min/km</span>
                </div>

                <div class="workout__details">
                    <span class="workout__icon">🦶🏼</span>
                    <span class="workout__value">${workout.cadence}</span>
                    <span class="workout__unit">step/min</span>
                </div>
            </li>
            `;
        }
        if(workout.type === 'cycling') {
            html += `
                <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.speed.toFixed(1)}</span>
                    <span class="workout__unit">km/hr</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⛰</span>
                    <span class="workout__value">${workout.eleGain}</span>
                    <span class="workout__unit">m</span>
                </div>
            </li>
            `;
        }
        form.insertAdjacentHTML('afterend', html);
    }

    _moveToPopup(e) {
        const workoutEl = e.target.closest('.workout');
        console.log(workoutEl);

        if(!workoutEl) return;

        const workout = this.#workouts.find(work => work.id === workoutEl.dataset.id);
        // console.log(workout);

        this.#map.setView(workout.coords, this.#mapZoom, {
            animate: true,
            pan: {
                duration: 1
            }
        });
        // using public interface
        // workout.click();
    }

    _setLS() {
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    }

    _getLS() {
        const data = JSON.parse(localStorage.getItem('workouts'));
        console.log(data);

        if(!data) return

        this.#workouts = data;

        this.#workouts.forEach(work => {
            this._renderWorkout(work);
        })
    };

    reset() {
        localStorage.removeItem('workouts');
        location.reload();
    }
};

const app = new App();



