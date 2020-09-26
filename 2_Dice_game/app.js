/*
Game rules:

- The game has 2 players, playing in rounds.
- In each turn, a player rolls a dice as many times as he wishes. Each result get added to his Round score.
- But, if the player rolls a 1, all his round score gets lost. After that, it's the next player turn.
- The player can choose to 'hold',  which means that his round score gets added to his global score. It's the next player's turn.
- the first player to reach 100 points on Global score wins the game.
- A player losese his turn if rolls 2 consecutive 6 in one go.( Hint: Always save the previous dice roll in a separate variable.)
- the players can set the winning score by adding an input field (Hiint: .value property can let the value be read in javascript.)
- Another dice is added to the mix. Player losses his current score if the one of the dice is '1'. (Hint: need CSS to position the second dice.)

*/

var scores, roundScore, activePlayer, dice, gamePlay;
gamePlay = true;
var lastDice;

newDice();

document.querySelector('.btn-roll').addEventListener('click', rollDice);

document.querySelector('.btn-hold').addEventListener('click', holdDice);

document.querySelector('.btn-new').addEventListener('click', newDice);


function nextPlayer() {
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');
    
    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';

}

function rollDice() {
    if (gamePlay) {
        // 1. Random Number btwn 1- 6
        var dice1 = Math.floor(Math.random() * 6) + 1;
        var dice2 = Math.floor(Math.random() * 6) + 1;

        // 2. Display the result from the hidden dice.
        document.getElementById('dice-1').style.display = 'block';
        document.getElementById('dice-2').style.display = 'block';

        document.getElementById('dice-1').src = './image/dice-' + dice1 + '.png';
        document.getElementById('dice-2').src = './image/dice-' + dice2 + '.png';


        // 3. Update the round score if the rolled number was NOT 1.
        if (dice1 !== 1 && dice2 !== 1) {
            // Add roundScore
            roundScore += dice1 + dice2;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        }else {
            // Next player
            nextPlayer();
        }

    }
}

function holdDice() {
    if (gamePlay) {
        // Add current Score to the Global Score
        score[activePlayer] += roundScore;

        //Update the User Interface.
        document.querySelector('#score-' + activePlayer).textContent = score[activePlayer];

        var input = document.querySelector('.final-score').value;
        var winScore;
        // undefined, '0', null or "" are coerced to false
        // Anything else is COERCED to true.
        if (input) {
            winScore = input;
        } else {
            winScore = 100;
        }

        //Check if the player won the game.
        if (score[activePlayer] >= winScore) {
            document.querySelector('#name-' + activePlayer).textContent = 'winner!';
            document.getElementById('dice-1').style.display = 'none';
            document.getElementById('dice-2').style.display = 'none';


            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner!');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gamePlay = false;

        } else {
            //Next player
            nextPlayer();
        }
    }
}
    
function newDice() {
    // Not only to be applied when pressed newGame button, but also to initiate at the beggining of the game.
    score = [0, 0];
    activePlayer = 0;
    roundScore = 0;

    document.getElementById('dice-1').style.display = 'none';
    document.getElementById('dice-2').style.display = 'none';

    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';

    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    document.getElementById('name-0').textContent = 'Player-1';
    document.getElementById('name-1').textContent = 'Player-2';

    document.querySelector('.player-0-panel').classList.remove('winner!');
    document.querySelector('.player-1-panel').classList.remove('winner!');

    document.querySelector('.player-1-panel').classList.remove('active');
    document.querySelector('.player-0-panel').classList.remove('active');

    document.querySelector('.player-0-panel').classList.add('active');
}
