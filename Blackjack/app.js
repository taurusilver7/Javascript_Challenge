// Challenge: Blackjack
// the player selects no of hits first. Meanwhile, stand & deal buttons doesn't work
// Now the dealer (bot) selects no of stands to compute a winner. meanwhile , the hit & deal buttons dosn't work.

let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],    // K,J,Q are 10 & A is 1 or 11.
    'cardMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11]},         // assinging the cards with values with an array.
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('./sounds/swish.m4a');
const winSound = new Audio('./sounds/cash.mp3');
const lossSound = new Audio('./sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);



function blackjackHit() {       // hit button to enter a card along with a sound.
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        console.log(card);
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];     //selecting a random card from the array.
}

function showCard(card, activepPlayer) {
    if (activepPlayer['score'] <= 21) {     // the cards stop showing after score crosses 21.
        let cardImage = document.createElement('img');
        cardImage.src = `./images/${card}.png`;       // using string template with ``   $ makes the card as variable
        document.querySelector(activepPlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

function blackjackDeal() {      // deal button to clear the inputs entered do far regardless of the side
    if (blackjackGame['turnsOver'] === true) {
        
        blackjackGame['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');   //selecting all images in the YOU side.
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');//selecting all the images in the DEALER side.

        for (let i = 0; i < yourImages.length; i++) {       // removing all images in YOU side using for loop
            yourImages[i].remove();
        }
        for (let i=0; i < dealerImages.length; i++) {       // removing all images in DEALER side using for loop.
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;   //player score reset to 0
        document.querySelector('#your-blackjack-result').style.color = '#ffffff'; // score color reset to 'white'

        document.querySelector('#dealer-blackjack-result').textContent = 0; // dealer score reset to 0
        document.querySelector('#dealer-blackjack-result').style.color = '#ffffff'; // score color reset to 'white'

        document.querySelector('#blackjack-result').textContent = "Let's Play"; // result tag reset to beginning
        document.querySelector('#blackjack-result').style.color = "black"; // result tag color reset.

        blackjackGame['turnsOver'] = true;
    }
}

function updateScore(card, activepPlayer) {
    if(card === 'A') {
    // if adding 11 keep below 21, add 11. If not, add 1
        if(activepPlayer['score'] + blackjackGame['cardMap'][card][1] <= 21) {//blackjackGame['cardmap'][card][1]==11.
            activepPlayer['score'] += blackjackGame['cardMap'][card][1];    // add 11 to 'score'
        } else {
            activepPlayer['score'] += blackjackGame['cardMap'][card][0];    //add 1 to the 'score'
        }
    } else {
    activepPlayer['score'] += blackjackGame['cardMap'][card];   // if card is not 'A', add card value to 'score'.
    }
}
    //the card value from the cardmap array from the blackjackGame array is added to the active player's score, whoever it is.
    // Updating the score on the backend.

function showScore(activepPlayer) {
    if (activepPlayer['score'] > 21) {
        document.querySelector(activepPlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activepPlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activepPlayer['scoreSpan']).textContent = activepPlayer['score'];
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));     // slow down the dealer  card playing speed
}


// during sleep. the dealerLogic function doesn't cause the browser to crash by being a sync (linear) function.
async function dealerLogic() {        // Dealer side game logic.
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    
    blackjackGame['turnsOver'] = true;
    let winner = computeWinner();
    showResult(winner);
    console.log(blackjackGame['turnsOver']);
}

// Compute winner and return who just won //
// Update the wins, losses & draws.
function computeWinner(){
    let winner;

    if(YOU['score'] <= 21) {
    // condition: higher score than dealer or when dealer busts but you're <= 21
        if(YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
            blackjackGame['wins']++;
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++;
            winner = DEALER;
        } else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++;
        }
    // condition: when user busts but dealer doesn't
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['losses']++;
        winner = DEALER;

    // condition: when user AND dealer busts..
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
    }

    console.log(blackjackGame);
    return winner;
}

function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true) {

        if(winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You won!';
            messageColor = 'green';
            winSound.play();

        } else if(winner === DEALER) {
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You lost!';
            messageColor = 'red';
            lossSound.play();
        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You drew!';
            messageColor = 'black';
        }
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}



































