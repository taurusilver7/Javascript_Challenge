

// Budget Controller
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percent = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) { 
        if (totalIncome > 0) {
           this.percent = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percent = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percent;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(curnt) {
            sum += curnt.value;
        });
       data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percent: -1,
    };
    // Adding a new item to the budget list. either inc/exp.
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            // Create a new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Create new item based on 'inc' or 'exp'
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // Push the item into the data structure.
            data.allItems[type].push(newItem);

            // Return the new element.
            return newItem;
        },


        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current) { // returns a copy of data.allItems[type] to ids.
                return current.id;
            });

            index = ids.indexOf(id); // indexOf return the index numb of element of array we input here(id)

            if (index !== -1) { //index can be -1 if item (id) is not found in array (ids)
                //slice is to create copy & splice is to remove elements
                data.allItems[type].splice(index, 1);//(arg1, arg2) => (position to start delete, no of items to delete)
            }
        },


        calculateBudget: function() {
            // Calculate total income & expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget : income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate thee percentage of the income the we spent.
            if (data.totals.inc > 0) {  // to avoid -ve percent if expenses only are available.
                data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percent = -1;
            }
        },

        calculatePercent: function() {
            data.allItems.exp.forEach(function(crnt) {
                crnt.calcPercentage(data.totals.inc);
            });

        },

        getPercent: function() {
            var allPercent = data.allItems.exp.map(function(crnt) {
                return crnt.getPercentage()
            });
            return allPercent;
        },

        // calculated budget is returned to the global controller to let it fwd it to UICtrl.
        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percent: data.percent,
            };
        },

        testing: function() {
            console.log(data);
        }
    };

})();

// User Interface Controller
var UIController = (function() {

    var DOMstring = {
        inputType: '.add-type',
        inputDescription: '.add-description',
        inputValue: '.add-value',
        inputBtn: '.add-btn',
        incomeContainer: '.income-list',
        expenseContainer: '.expenses-list',
        budgetLabel: '.budget-value',
        incomeLabel: '.budget-income-value',
        expensesLabel: '.budget-expenses-value',
        percentLabel: '.budget-expenses-percent',
        container: '.container',
        expPercLabel: '.item-percent',
        dateLabel: '.budget-title-month',
    };

    var formatNumber = function(num, type) {
        var num, numSplit, int, dec;

        // abs removes the sign off the number.
        num = Math.abs(num);

        // put 2 decimals after the number.
        num = num.toFixed(2);

        // splits the number into integer & decimal.
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            // method substring which takes a part of the string. returns part of the string.
            // start at zeros place upto thsnds. + , + start at thsnd upto 1lakh
            int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3);
        }
        dec = numSplit[1];
        // Number format form = + 2,125.25
        return(type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
        
    };

    // for loop for nodel list throughout the app.
    // a for loop, in each iter, calls for the callback function, which the nodelstForeach function again.
    var nodelstForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i); // args = crnt,index.
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstring.inputType).value,//inc or exp
                description: document.querySelector(DOMstring.inputDescription).value,// dscrptn
                value: parseFloat(document.querySelector(DOMstring.inputValue).value),// inc/exp value. parseFloat convs strings to floats.
            };  
        },

        addListItem: function(obj, type) {
            var html, element;
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMstring.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item-description">%description%</div><div class="right clearfix"> <div class="item-value">%value%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstring.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item-description">%description%</div><div class="right clearfix"> <div class="item-value">%value%</div><div class="item-percent"></div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM.
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectID) { //selectID is itemID
            var elmnt = document.getElementById(selectID);
            elmnt.parentNode.removeChild(elmnt);

        },

        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstring.inputDescription + ',' + DOMstring.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) { //array=fieldsArr, current=fields
                current.value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
            document.querySelector(DOMstring.expensesLabel).textContent = formatNumber(obj.totalExpenses, 'exp');
            

            if (obj.percent > 0) {
                document.querySelector(DOMstring.percentLabel).textContent = obj.percent + '%';
            } else {
                document.querySelector(DOMstring.percentLabel).textContent = '---';
            }
        },

        displayPercent: function(percentages) {
            var fields = document.querySelectorAll(DOMstring.expPercLabel);

            // the function in the nodelstforEach isthe callback function above.

            nodelstForEach(fields, function(crnt, index) {

                if (percentages[index] > 0) {
                    crnt.textContent = percentages[index] + '%';
                } else {
                    crnt.textContent = '-----';
                }
            });

        },

        displayMonth: function() {
            var now, month, months, year;

            // var chirstmas = new Date(2018, 11, 25);

            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstring.dateLabel).textContent = months[month] + ' ' + year;
        },

        changeType: function() {

            var fields = document.querySelectorAll(
                DOMstring.inputType + ',' + 
                DOMstring.inputDescription + ',' + 
                DOMstring.inputValue);
            
            nodelstForEach(fields, function(crnt) {
                crnt.classList.toggle('red-focus');
            });
            document.querySelector(DOMstring.inputBtn).classList.toggle('red');

        },

        getDOMstring: function() {
            return DOMstring;
        }
    }

})();

/* budgetController & UIController doesn't aboout other's existence. Another module is created to act as link between the two modules i.e, 

     Global App Controller */ 

var controller = (function(budgetCtrl, UICtrl) {

    var setEventListener = function() {
        var DOM = UICtrl.getDOMstring();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    var updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return  the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercent = function() {

        // 1. Calculate the percentages
        budgetCtrl.calculatePercent();

        // 2. read pecentages from the budget controller.
        var percent = budgetCtrl.getPercent();

        // 3. Update the UI with the new percentages.
        UICtrl.displayPercent(percent);
    }


    var ctrlAddItem = function() {
        var input, newItem

        // 1. Get the filled input data.
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add  the item to the budget controller.
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI.
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate & update Budget.
            updateBudget();

            // 6. Calculate & update percentages.
            updatePercent();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        // DOM traversing.
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // to bring the id from (item-delete-btn) to (inc/exp-0) through 4 consecutive parentNode processess.
        //console.log(itemID);

        if (itemID) {

            splitID = itemID.split("-");// inc-1
            type = splitID[0];
            ID = parseInt(splitID[1]);    // the value is string which is splitted & caannot be used in budget.

            // 1. Delete the item from data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show new budget.
            updateBudget();

            // 4. Calculate & update percentages.
            updatePercent();
        }

};

    return {
        init: function() {
            console.log('Application has been started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0.00,
                totalIncome: 0.00,
                totalExpenses: 0.00,
                percent: -1,
            }); // reset the budget values. set it to a similar budget obj with all 0.
            setEventListener(); // carries all event listeners.
        }
    };

})(budgetController, UIController);


controller.init(); // without this line, nothing works.













