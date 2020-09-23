/*
Game rules:

- The game has 2 players, playing in rounds.
- In each turn, a player rolls a dice as many times as he wishes. Each result get added to his Round score.
- But, if the player rolls a 1, all his round score gets lost. After that, it's the next player turn.
- The player can choose to 'hold',  which means that his round score gets added to his global score. It's the next player's turn.
- the first player to reach 100 points on Global score wins the game.

*/

var scores, roundScore, activePlayer, dice, gamePlay;
gamePlay = true;

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
    
    document.querySelector('.dice').style.display = 'none';
}

function rollDice() {
    if (gamePlay) {
        // 1. Random Number btwn 1- 6
        var dice = Math.floor(Math.random() * 6) + 1;

        // 2. Display the result from the hidden dice.
        document.querySelector('.dice').style.display = 'block';
        document.querySelector('.dice').src = './image/dice-' + dice + '.png';

        // 3. Update the round score if the rolled number was NOT 1.
        if (dice !== 1) {
            // Add Score
            roundScore += dice;
            // roundScore = roundScore + dice;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        }else {
            // Next Player with terenary operator.
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

        //Check if the player won the game.
        if (score[activePlayer] >= 100) {
            document.querySelector('#name-' + activePlayer).textContent = 'winner!';
            document.querySelector('.dice').style.display = 'none';

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

    document.querySelector('.dice').style.display = 'none';

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
