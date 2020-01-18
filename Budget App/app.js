//////////////////////////////////////////////////////////////////////////////////////////////////
// BUDGET CONTROLLER //

const budgetController = (() => {
	
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	}
	Expense.prototype.calcPercentage = function(totalIncome){
		if(totalIncome > 0){
		this.percentage = Math.round((this.value / totalIncome)*100)
		}else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function(){
		return this.percentage;
	}

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type){
		// get the array, separated by type
		var sum = 0;
		data.allItems[type].forEach(function(cur){
			sum += cur.value;
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
		percentage: -1,
	};
	


	return {
		addItem: function(type, des, val){
			var newItem, ID;
			ID = 0;
			// creating an unique import ID;
			if(data.allItems[type].length > 0){
			ID = data.allItems[type][data.allItems[type].length -1 ].id + 1  
			} else {
				ID = 0;
			}
			// Create new Item based on 'inc' or 'exp' type
			if(type === 'exp'){
			newItem = new Expense(ID, des, val);
			} else if (type === 'inc'){
				newItem = new Income(ID, des, val);
			}
			// Push it into the data structure
			data.allItems[type].push(newItem)

			// Return new element
			return newItem; // return so the other modules have access to the created item
		},

		deleteItem: function(type, id){
			var ids, index;
			ids = data.allItems[type].map(function(curr, i, arr){
				return curr.id;
			});
			index = ids.indexOf(id)
			if(index !== -1){
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function(){

			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			// calculate the % of income that has been spent
			if(data.totals.inc > 0){
			data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
			}else{
				data.percentage = -1;
			}
		},
		calculatePercentages: function(){
			data.allItems.exp.forEach(function(cur){
				cur.calcPercentage(data.totals.inc);
			});
		},
		getPercentages: function(){
			var allPerc;
			allPerc = data.allItems.exp.map(function(cur){
				return cur.getPercentage();
			});
			return allPerc;
		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		testing: function(){
			console.log(data);
		}
	}
	
})();
//////////////////////////////////////////////////////////////////////////////////////////////////
// UI CONTROLLER //

const UIController = (() => {

	var DOMStrings = {
		inputType:'.add__type',
		inputDescription:'.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel:'.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month',
	}

	var formatNumber = function(num, type){
		var numSplit, int, dec
		// + or - before formatNumber, exactly 2 decimal points, comma separating the thousands

		num = Math.abs(num);
		num = num.toFixed(2); // transform the num to a string with 2 decimal points

		numSplit = num.split('.');
		int = numSplit[0];
		if(int.length > 3){
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length -3, 3)
		}
		dec = numSplit[1];
		return (type === 'exp'? '-':'+') + ' ' + int + '.' + dec;
	};

	return{
		// Public method to get user input and make it globally available
		getInput: function(){
			return{ // controller will call this method to get these values
				type: document.querySelector(DOMStrings.inputType).value, // returns "inc" or "exp"
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value),	
			}
		},

		addListItem: function(obj, type){
			var html, newHTML, element;
			// Create HTML string with placeholder text: 
			if(type === 'inc'){
			element = DOMStrings.incomeContainer;
			html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp'){
			element = DOMStrings.expensesContainer;
			html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}		
			// Replace the placeholder text with some actual data
			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

			// Insert the HTML to the DOM
			document.querySelector(element).insertAdjacentHTML('beforebegin', newHTML)
		},

		// Method so the controller has access to DOMStrings obj
		getDOMstrings: function(){
			return DOMStrings;
		},

		deleteListItem: function(selectorID){
			var el;
			el = document.getElementById(selectorID);
			el.parentNode.removeChild(el)
		},

		clearFields: function(){
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

			// Query Selector All returns a list not a array. So we have to convert it;
			fieldsArr = Array.prototype.slice.call(fields); 
			fieldsArr.forEach(function (current) { // forEach has access to those 3 para (current, index, array)
				current.value = '';
			});
			fieldsArr[0].focus();
		},
		displayBudget: function(obj){
			var type;
			obj.budget > 0? type = 'inc': type = 'exp';

			window.addEventListener('DOMContentLoaded', function(){ // this fn fix the .textContent null error
				document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
				document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
				document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
				if(obj.percentage > 0){
					document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
				}else {
					document.querySelector(DOMStrings.percentageLabel).textContent = '---';
				}
			});
	
			
		},
		displayPercentages: function(percentages){
			var fields;
			fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

			fields.forEach(function(cur, i){
				if(percentages[i] > 0){
					cur.textContent = percentages[i] + '%';
				} else {
					cur.textContent = '---';
				}
			});
			// var nodeListForEach = function(list, callback){
			// 	for(i = 0; i < list.length; i++){
			// 		callback(list[i], [i])
			// 	}
			// };
			// nodeListForEach(fields, function(current, index){
			// 	if(percentages[index] > 0){
			// 	current.textContent = percentages[index] + '%';
			// 	} else {
			// 		current.textContent = '---'
			// 	}
			// });
		},
		displayMonth: function(){
			var now, year, month, months;
			now = new Date();
			month = now.getMonth();
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			year = now.getFullYear();
			window.onload = function(){
			document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
			}
		},
		changedType: function(){
			var fields = document.querySelectorAll(
				DOMStrings.inputType + ', ' +
				DOMStrings.inputDescription + ', ' +
				DOMStrings.inputValue);
			fields.forEach(function(cur, i){
				cur.classList.toggle('red-focus');
			});
			document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
		},
	}
})()
//////////////////////////////////////////////////////////////////////////////////////////////////
// GLOBAL APP CONTROLLER //

var controller = (function(budgetCtrl, UICtrl){
	
	var setupEventListeners = function(){ // putting all eventListeners on one fn
		
			var DOM = UICtrl.getDOMstrings();
			window.onload = function(){
				document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
			//this fn is to avoid errors on eventListeners, wait for the page to load so it won't return null
				document.addEventListener('keypress', function(e){
				if(e.keyCode === 13 || e.charCode === 13){
					ctrlAddItem();
				}
			}); 
			// delete items with X btn
			document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

			// change input field colors: green for income and red for exp
			document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
	}};

	var updateBudget = function(){
			// 1. Calculate the budget
		budgetController.calculateBudget();
			// 2. Return the Budget
		var budget = budgetController.getBudget();

			// 3. Display the budget on the UI
		UICtrl.displayBudget(budget);
	};
	var updatePercentages = function(){

		// 1. Calculate Percentages
		budgetController.calculatePercentages();
		// 2. Read percentages from budget controller
		var percentages = budgetController.getPercentages();
		// 3. Update user interface
		UICtrl.displayPercentages(percentages);
	};

	var ctrlAddItem = function(){
		var input, newItem;
			// 1. Get the field input data
		input = UICtrl.getInput();
		if (input.description !== "" && !isNaN(input.value)&& input.value >0){

			// 2. Add the item to the budget controller
		newItem = budgetController.addItem(input.type, input.description, input.value)

			// 3. Add the item to the UI 
		UICtrl.addListItem(newItem, input.type);

			// 4. Clear Input Fields
		UICtrl.clearFields();

			// 5. Calculate and update Budget
		updateBudget();

			// 6. Calculate and Update percentages
		updatePercentages();

		}
	};

	var ctrlDeleteItem = function(e){
		var itemID, splitID, type, ID;
		itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);
		if(itemID){
			// inc-1
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// 1. Delete the item from the data structure
			budgetController.deleteItem(type, ID);

			// 2. Delete item from UI
			UICtrl.deleteListItem(itemID);

			// 3. Update and show the new Budget
			updateBudget();

			// 4. Calculate and Update Percentages
			updatePercentages();
		}
	};

	return{
		init: function(){
			console.log('application has started');
			UIController.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	}
	
	})(budgetController, UIController);
////////////////////////////////////////
// GLOBAL SCOPE //

// without this line nothing runs, no eventListeners
controller.init();

