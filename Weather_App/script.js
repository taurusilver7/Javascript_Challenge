
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

const API_KEY = '3265874a2c77ae4a04bb96236a642d2f';

// const APIURL = 'https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/';

const url = (city) => {
    `https://api.openweathermap.org/data/2.5/weather>q=${city}&appid=${API_KEY}`;
}

async function getWeatherbyLocation(city) {
    const resp = await fetch(url(city));
    const respData = await resp.json();

    console.log(respData, KtoC(respData.main.temp));

    addWeathertoPage(respData);
};

function addWeathertoPage(data) {
    const temp = KtoC(data.main.temp);

    const weather = document.createElement('div');
    weather.classList.add('weather');

    weather.innerHTML = `
        <small>There are</small>
        <h2><img src='https://openweathermap.org/img/w/${data.weather[0].icon}.png' />${temp}°C</h2>        
    `;
    // clean up
    main.innerHTML = '';

    main.appendChild(weather);
}

function KtoC(k) {
    return Math.floor(k - 273.15);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const city = search.value;
    if(city) {
        getWeatherbyLocation(city);
    }
})