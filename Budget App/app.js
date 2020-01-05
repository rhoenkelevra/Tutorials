//////////////////////////////////////////////////////////////////////////////////////////////////
// BUDGET CONTROLLER //
const budgetController = (() => {
	
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	}
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	}
	
	var totalExpenses = 0;
	var totalIncomes = 0;
	
})();
//////////////////////////////////////////////////////////////////////////////////////////////////
// UI CONTROLLER //

const UIController = (() => {

	var DOMStrings = {
		inputType:'.add__type',
		inputDescription:'.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',

	}

	return{
		// Public method to get user input and make it globally available
		getInput: function(){
			return{ // controller will call this method to get these values
				type: document.querySelector(DOMStrings.inputType).value, // returns "inc" or "exp"
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: document.querySelector(DOMStrings.inputValue).value,	
			}
		},

		// Method so the controller has access to DOMStrings obj
		getDOMstrings: function(){
			return DOMStrings;
		}
	}
	
})()
//////////////////////////////////////////////////////////////////////////////////////////////////
// GLOBAL APP CONTROLLER //

var controller = (function(budgetCtrl, UICtrl){
	
	var setupEventListeners = function(){ // putting all eventListeners on one fn
		
			var DOM = UICtrl.getDOMstrings();
			window.onload = function(){ // added this fn so quokka won't return error: 
			// "Cannot read property 'addEventListener' of null", on the btn 	
			document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

			document.addEventListener('keypress', function(e){
				if(e.keyCode === 13 || e.charCode === 13){
					ctrlAddItem();
				}
			}) ; 
		};
	}
	var ctrlAddItem = function(){
			// 1. Get the field input data
		var input = UICtrl.getInput();
		console.log(input)
			// 2. Add the item to the budget controller

			// 3. Add the item to the UI 

			// 4. Calculate the budget

			// 5. Display the budget on the UI

	}

	return{
		init: function(){
			console.log('application has started')
			setupEventListeners();
		}
	}
	
	})(budgetController, UIController);
////////////////////////////////////////
// GLOBAL SCOPE //

// without this line nothing runs, no eventListeners
controller.init();
