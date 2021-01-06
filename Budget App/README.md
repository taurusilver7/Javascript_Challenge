# Budget App
#### A budget application to carry out the expenses and incomes at close range values.
#### The application calculates expense percent of the income, budget preferred for months.
#### The application is an user-interactive model to respond to every additional, removal of an item to the equation.
***
<p align="center">
  <img src="./budget.png" width="350" title="hover text">
</p>

## All the modules in the application are listed below.
**budgetController**
* _Expenses_ & _income_ functions
* data object to collect all exp & inc
* _addItem_ & _deleteItem_ functions to add an item to the app
* _calculateBudget_ & _calculatePercent_ function to calculate budget & percents
* _getBudget_ & _getPercent_ function to return budget & percent to the display.


**UIController**
* DOMstrings objects to link HTML elements to Javascript
* _getInput_ function to get the item values from UI
* _addListItem_ & _delteListItem_ functions to add & delete data obtained from HTML placeholders to app.js
* _displayBudget_& _displayPercent_ & _displayMonth_ functions to display the calculated budget, percent & month from the **budgetController**


**controller**
* _setEventListener_ function to assign functions to each button on the app.
* _updateBudet_ & _updatePercent_ functions to recalculate budget & percent if items are added or removed.
* _ctrladdItem_ & _ctrldeleteItem_ functions.
* _init_ initilization function for the application to start without a glitch.
