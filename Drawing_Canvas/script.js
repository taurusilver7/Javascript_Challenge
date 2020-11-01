
const canvas = document.getElementById('canvas');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEl = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearEl = document.getElementById('clear');

const ctx = canvas.getContext('2d');

let size = 30;// temporary brush size
let isPressed = true;
let color = 'black';
let x = undefined;
let y = undefined;

canvas.addEventListener('mousedown', (e)=> {
    isPressed = true;

    x = e.offsetX
    y = e.offsetY
});

canvas.addEventListener('mouseup', ()=> {
    isPressed = false;

    x = undefined;
    y = undefined;
});

canvas.addEventListener('mousemove', (e) => {
    if(isPressed) {
        const x2 = e.offsetX
        const y2 = e.offsetY

        drawCircle(x2, y2);
        drawLine(x, y, x2, y2);
        x = x2;
        y = y2;
    }
});

increaseBtn.addEventListener('click', () => {
    size += 2;

    if(size > 50) {
        size = 50;
    }
    updateSize();
});

decreaseBtn.addEventListener('click', () => {
    size -= 2;

    if(size < 5) {
        size = 5;
    }
    updateSize();
});

colorEl.addEventListener('change', (e) => {
    color = e.target.value;
});

clearEl.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function updateSize() {
    sizeEl.innerText = size;
}

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x,y,size,0,Math.PI*2);   
    // js syntax- arc(x,y,radius,startangle,endangle)
    ctx.fillStyle = color;
    ctx.fill();   // draw circle.
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 2;
    ctx.stroke();
}
