
const pwdEl = document.getElementById('pwd');
const copyEl = document.getElementById('copy');
const lengthEl = document.getElementById('length');
const upperEl = document.getElementById('upper');
const lowerEl = document.getElementById('lower');
const numberEl = document.getElementById('number');
const symbolEl = document.getElementById('symbol');
const generateEl = document.getElementById('generate');

const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()_=+';

function getUpperCase() {
    return upperLetters[Math.floor(Math.random() * upperLetters.length)];
};

function getLowerCase() {
    return lowerLetters[Math.floor(Math.random() * lowerLetters.length)];
};

function getNumbers() {
    return numbers[Math.floor(Math.random() * numbers.length)];
};

function getSymbols() {
    return symbols[Math.floor(Math.random() * symbols.length)];
};

function generatePassword() {
    const len = lengthEl.value;

    let password = '';

    if(upperEl.checked) {
        password += getUpperCase();
    }
    if(lowerEl.checked) {
        password += getLowerCase();
    }
    if(numberEl.checked) {
        password += getNumbers();
    }
    if(symbolEl.checked) {
        password += getSymbols();
    }

    for(let i = password.length-1;i < len; i++) {
        const x = generateX();
        password += x;
    }

    pwdEl.innerText = password;
};

function generateX() {
    const value = [];
    if(upperEl.checked) {
        value.push(getUpperCase());
    }
    if(lowerEl.checked) {
        value.push(getLowerCase());
    }
    if(numberEl.checked) {
        value.push(getNumbers());
    }
    if(symbolEl.checked) {
        value.push(getSymbols());
    }

    if(value.length === 0) return '';

    return value[Math.floor(Math.random()* value.length)];
}

generateEl.addEventListener('click', generatePassword);

copyEl.addEventListener('click', () => {
    // create a textarea element to save password
    const textArea = document.createElement('textarea');

    // password from display is in password variable
    const password = pwdEl.innerText;

    //check if password is empty.
    if(!password) {
        return;
    }

    textArea.value = password;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    alert('Password copied to clipboard');

})


