

let secHand = document.querySelector('.sec-hand');
let minHand = document.querySelector('.min-hand');
let hourHand = document.querySelector('.hour-hand');


function setDate() {
    const now = new Date();
    const sec = now.getSeconds();
    const secDegree = ((sec / 60) * 360) + 90; // set seconds into degrees for the clock.
    secHand.style.transform = `rotate(${secDegree}deg)`;
    console.log(secDegree);

    const mins = now.getMinutes();
    const minDegree = ((mins / 360) * 360) + 90;
    minHand.style.transform = `rotate(${minDegree}deg)`;

    const hour = now.getHours();
    const hourDegree = ((hour / 12) * 360) + 90;
    hourHand.style.transform = `rotate(${hourDegree}deg)`
}


setInterval(setDate, 1000);