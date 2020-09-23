# A 2 player, single-dice game.
The game for 2-players, 1-diced with a variable final score to boot.


## Game rules:

* The game has **2** players, playing in rounds.
* In each turn, a player rolls a dice as many times as he wishes. Each result get added to his Round score.
* But, if the player rolls a **1**, all his round score gets lost. After that, it's the next player turn.
* The player can choose to **hold**,  which means that his round score gets added to his global score. It's the next player's turn.
* the first player to reach **100** points on Global score wins the game.
* A player losese his turn if rolls **2** consecutive _6_ in one go._( Hint: Always save the previous dice roll in a separate variable.)_
* the players can set the winning score by adding an input field _(Hiint: .value property can let the value be read in javascript.)_
* Another dice is added to the mix. Player losses his current score if the one of the dice is **1**. _(Hint: need CSS to position the second dice.)
