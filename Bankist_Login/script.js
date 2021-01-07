"use strict";

////// Bankist App //////

// Data 


const account1 = {
    owner: 'Veera Manish Polamarasetty',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    movementsDates: [
        '2019-09-01T13:15:33.035Z',
        '2019-11-17T09:48:16.867Z',
        '2019-12-15T06:04:23.907Z',
        '2020-01-20T14:18:46.235Z',
        '2020-03-05T16:33:06.386Z',
        '2020-05-12T14:43:26.374Z',
        '2020-06-22T18:49:59.371Z',
        '2020-08-26T12:01:20.894Z',
    ],
    pin: 12345,
};
  
const account2 = {
    owner: 'Bhuvan Chandra Nekkala',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    movementsDates: [
        '2019-10-08T21:31:17.178Z',
        '2019-12-13T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-03-06T10:17:24.185Z',
        '2020-05-18T14:11:59.604Z',
        '2020-07-02T17:01:17.194Z',
        '2020-07-28T23:36:17.929Z',
        '2020-09-13T10:51:36.790Z',
    ],
    pin: 56789,
};
  
const account3 = {
    owner: 'Divya Vani Padala',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    pin: 54321,
};
  
const account4 = {
    owner: 'Praveen Kumar Sarisa',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-07-26T17:01:17.194Z',
        '2020-07-28T23:36:17.929Z',
        '2020-08-01T10:51:36.790Z',
    ],
    pin: 98765,
};

// cannot access account before initialization.
const accounts = [account1, account2, account3, account4];

//// Elements

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSummIn = document.querySelector('.summary__value.in');
const labelSummOut = document.querySelector('.summary__value.out');
const labelSummIntrest = document.querySelector('.summary__value.intrest');
const labelTimer = document.querySelector('.timer');


const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnSort = document.querySelector('.btn--sort');

const btnTransfer = document.querySelector('.form__btn.transfer');
const btnLoan = document.querySelector('.form__btn.loan');
const btnClose = document.querySelector('.form__btn.close');

const inputLoginUser = document.querySelector('.login__input.user');
const inputLoginPin = document.querySelector('.login__input.pin');
const inputTransferTo = document.querySelector('.form__input.to');
const inputTransferAmount = document.querySelector('.form__input.amount');
const inputLoanAmount = document.querySelector('.form__input.loan-amount');
const inputCloseUser = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



//  display functions

const formatDate = (date) => {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2-date1)/(1000*60*60*24));

    const daysPassed = calcDaysPassed(new Date(), date);
    // console.log(daysPassed);

    if(daysPassed === 0) return 'Today';
    if(daysPassed === 1) return 'Yesterday';
    if(daysPassed <= 7) return `${daysPassed} days ago`;
    else {
        // const day = `${date.getDate()}`.padStart(2, 0);
        // const month = `${date.getMonth() + 1}`.padStart(2, 0);
        // const year = date.getFullYear();
        return new Intl.DateTimeFormat('en-IN').format(date);
    };
};

const formatCurrency = (value) => {
    return new Intl.DateTimeFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
};

const displayMovements = (acc, sort = false) => {

    containerMovements.innerHTML = '';
    
    // sort the movements in ascending order. a-b<0? keep order: switch order.
    const movement = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

    movement.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawl';

        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatDate(date);

        const html = `
            <div class="movements__row">
                <div class="movements__type ${type}">${i+1} ${type}</div>
                <div class="movements__date">${displayDate}</div>
                <div class="movements__value">₹ ${mov.toFixed(2)}</div>
            </div>
        `;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    })
};

//  calculating & displaying balance on the app.
const displayBalance = (acc) => {
    const balance = acc.movements.reduce((ac, cur) => ac + cur, 0);
    acc.balance = balance;
    labelBalance.textContent = `₹ ${acc.balance.toFixed(2)}`;
};


// display deposits, withdrawls , intrests on the summary
const displaySummary = (acc) => {
    const deposits = acc.movements.filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0);
    // console.log(deposits);
    labelSummIn.textContent = `₹.${deposits.toFixed(2)}`;

    const withdrawls = acc.movements.filter(mov => mov < 0).reduce((acc, cur) => acc + cur, 0);
    // console.log(withdrawls);
    labelSummOut.textContent = `₹.${Math.abs(withdrawls.toFixed(2))}`;

    const interest = acc.movements.filter(mov => mov > 0).map(dep => dep * acc.interestRate).filter(int => int >= 1).reduce((ac, cur) => ac + cur, 0);
    // console.log(intrest);
    labelSummIntrest.textContent = `₹.${Math.round(interest.toFixed(2))}`;
}


const createUsername = (user) => {
    user.forEach(ac => {
        ac.username = ac.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    });
};
createUsername(accounts);



const updateUI = (acc) => {
    // Display balance
    displayBalance(acc);

    // display movements
    displayMovements(acc);

    // display summary
    displaySummary(acc);
};

const startTimeOut = () => {
    const tick = () => {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = String(time % 60).padStart(2, 0);
        //  to each call, print rem time to UI
        labelTimer.textContent = `${min}:${sec}`;
        // decrease 1s
        time--;
        // when hit 0s, log user out.
        if(time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = 'Log in to get started';
            containerApp.style.opacity = 0;
        };
    };
    // set time to 5 mins
    let time = 120;
    // call the timer every sec
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
};



// Event handler - LOGIN

let currentAcc, timer;

btnLogin.addEventListener('click', (e) => {

    // prevent form from submitting
    e.preventDefault();

    currentAcc = accounts.find(acc => acc.username === inputLoginUser.value);
    console.log(currentAcc);

    if(currentAcc.pin === +inputLoginPin.value) {

        // Display UI & welcome message. 
        // first name & fade out effect to display details
        labelWelcome.textContent = `Welcome back, ${currentAcc.owner.split(' ')[0]}`;
        containerApp.style.opacity = 100;

        // create current date & time
        // to get date at current balance in Int Standard.
        const now = new Date();
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            weekday: 'short'
        };
        // const locale = navigator.language; to set time format based on country
        
        labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(now);

        // clear input fields
        inputLoginUser.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        // timer reset/set when user changes
        if(timer) clearInterval(timer);
        timer = startTimeOut();

        // Update the UI
        updateUI(currentAcc);

    } else {
        // console.log('Error');
        // Display Error Message
        labelWelcome.textContent = `Sorry, the credentials are incorrect. Please Retry!`;
        labelWelcome.style.color = 'red';

        // hide UI
        containerApp.style.opacity = 0;

        //  clear the entered credentials
        inputLoginUser.value = inputLoginPin.value = '';
    };
});

//  Event handler - TRANSFER
btnTransfer.addEventListener('click', (e) => {
    // prevent form from submitting
    e.preventDefault();

    const amount = +inputTransferAmount.value;
    const recAcc = accounts.find(acc => acc.username === inputTransferTo.value);

    // check if sender has amount, 
    if(amount > 0 && recAcc && currentAcc.balance >= amount && recAcc?.username !== currentAcc.username) {
        // tranferring
        currentAcc.movements.push(-amount);
        recAcc.movements.push(amount);

        // add transfer date 
        currentAcc.movementsDates.push(new Date().toISOString());
        recAcc.movementsDates.push(new Date().toISOString());

        // update the UI
        updateUI(currentAcc);

        // reset the timer
        clearInterval(timer);
        timer = startTimeOut();
    };
    inputTransferAmount.value = inputTransferTo.value = '';

});

// Event handler - LOAN
btnLoan.addEventListener('click', (e) => {
    // prevent the form from submitting
    e.preventDefault();

    const amount = Math.floor(inputLoanAmount.value);

    // check for valid loan & cdtn that a deposit > 10%loan amount.
    if(amount > 0 && currentAcc.movements.some(mov => mov >= amount*0.1)) {
        setTimeout(() => {
            //add +ve movement to account
            currentAcc.movements.push(amount);

            // add loan date
            currentAcc.movementsDates.push(new Date().toISOString());

            // update the UI
            updateUI(currentAcc);

            // Reset timer
            clearInterval(timer);
            timer = startTimeOut();
        }, 2500);
    }
    inputLoanAmount.value = '';
});

// Event handler - CLOSE
btnClose.addEventListener('click', (e) => {
    // prevent the form from submitting
    e.preventDefault();

    // check if the entered closing acc details are valid and correct
    if (inputCloseUser.value === currentAcc.username && +inputClosePin.value === currentAcc.pin) {
        const index = accounts.findIndex(ac => ac.username === currentAcc.username);

        // Delete account
        accounts.splice(index, 1);

        // hide UI
        containerApp.style.opacity = 0;
    }
    inputCloseUser.value = inputClosePin.value = '';
});

let sorted = false;

// Event Handler - Sort.
btnSort.addEventListener('click', (e) => {
    e.preventDefault();
    displayMovements(currentAcc, !sorted);
    sorted = !sorted;
});