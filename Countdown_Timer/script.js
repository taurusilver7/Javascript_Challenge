/* Need ending date, Current date. subtraction results in remaining days.*/

const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minsElement = document.getElementById('mins');
const secElement = document.getElementById('seconds');

const newYear = '1 Jan 2021';

function countdown() {
    const newYearDate = new Date(newYear);
    const currentDate = new Date();

    const totalSec = (newYearDate - currentDate) / 1000;
    const days = Math.floor(totalSec / 3600 / 24);
    const hours = Math.floor(totalSec / 3600) % 24;
    const mins = Math.floor(totalSec / 60) % 60;
    const sec = Math.floor(totalSec) % 60;

    daysElement.innerHTML = days;
    hoursElement.innerHTML = formatTime(hours);
    minsElement.innerHTML = formatTime(mins);
    secElement.innerHTML = formatTime(sec);
}

function formatTime(time) {
    return time < 10 ? (`0${time}`) : time;
}


// Initial call
countdown();

setInterval(countdown, 1000);