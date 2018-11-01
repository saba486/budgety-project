// BUDGET CONTROLLER
var budgetController = (function () {
    
 var Expence = function(id, description, value) {
     this.id = id;
     this.description = description;
     this.value = value;
 };
    var Income = function(id, description, value) {
     this.id = id;
     this.description = description;
     this.value = value;
    };
    
  var calculateTotal = function(type) {
      var sum = 0;
      data.allItems[type].forEach(function(cur) {
        sum += cur.value;     
      });
      data.totals[type] = sum;
  };  
    
    
    
    
var data = {
    allItems : {
     exp: [],  
     inc:[]   
    },
   totals: {
       exp: 0,
       inc: 0
   },
    
    budget : 0,
    percentage: -1
};
    
    return {
        addItems : function(type, des ,val) {
            var newItem , ID;
   // Create new ID         
       if(data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;   
       }  else {
           ID = 0;
       }   
        
            
     // Create new item based on inc or exp
            
            if(type === 'exp'){
             newItem = new Expence(ID, des, val);   
            } else if(type === 'inc') {
              newItem = new Income(ID, des, val);   
            }
         
        // push it in data structure
            data.allItems[type].push(newItem);
            
            // return new Element
            
            return newItem;
        },
        
        calculateBudget: function() { 
      // calculate total income and expences 
        calculateTotal('exp');
        calculateTotal ('inc');
        
     // calculate the budget : Income - Expence
        data.budget = data.totals.inc - data.totals.exp;
        
    // calculate the percentage of income that we spent 
        if(data.totals.inc > 0){
          data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100) ;
          
        } else {
            data.percentage = -1;
        }
        
        
 },
        getBudget: function() {
           return {
               budget: data.budget,
               totalInc: data.totals.inc,
               totalExp: data.totals.exp,
               percentage: data.percentage
           }; 
        },
        
        
        testing: function() {
            console.log(data);
        }
    };
    
        
    
})();




// UI controller
var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn : '.add__btn',
        incomeContainer: '.income__list',
        expenceContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage' ,
        container:'.container'
    };
    
  return {
      getinput: function() {
          return {
              type: document.querySelector(DOMstrings.inputType).value, // will be eigther exp or inc
              description: document.querySelector(DOMstrings.inputDescription).value ,
              value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
          };
      
  },
   addListItem: function(obj, type){
       // create html string with palceholder text
       
       var html, newHtml,element;
       
       if(type === 'inc'){ 
           element = DOMstrings.incomeContainer;
     html = '<div class="item clearfix" id="income-%d%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
       }
       else if(type === 'exp') {
      element = DOMstrings.expenceContainer;     
      html =  '<div class="item clearfix" id="expense-%d%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           }
       
       // Replace the placeholder text with actual date 
       
       newHtml = html.replace('%id%' ,obj.id);
       
       newHtml = newHtml.replace('%description%', obj.description);
       newHtml = newHtml.replace('%value%', obj.value);
       
       // INSERT html into the DOM
       document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
       
   },   
      
    clearFields: function() {
     var fields,fieldsArr;
    fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue); 
    fieldsArr = Array.prototype.slice.call(fields);
   fieldsArr.forEach(function(current, index, array) {
    current.value = "";  
     });  
        
    fieldsArr[0].focus();    
    },  
      displayBudget: function(obj) { 
       
document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;  
document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;  
document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;  
 
          
    if(obj.percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';  
    }  else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '-----';  
    }     
          
      }, 
      
    getDOMstrings: function() {
        return DOMstrings;
    }  
  };  
    
  // code  
    
    
})();




 // GLOBAL APP CONTROLER
var controller = (function(budgetCtrl, UIctrl) { 
    var setupEventListeners = function() {
        var DOM = UIctrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click' ,ctrlAddItem); 
    
    // When press the enter key from keyborad 
document.addEventListener('keypress', function(event) { 
    
    if(event.keyCode === 13 || event.which === 13) {
        
        // add function 
        ctrlAddItem(); 
        
    }
    
    });
    document.querySelector(DOM.container).addEventListener('click' , ctrlDeleteItem); 
    };
    
    var updateBudget = function() {
        
    // 1. Calculate the budget
        budgetCtrl.calculateBudget();
     // 2. Return the budget 
        var budget = budgetCtrl.getBudget();
                                                     
     // .3 Display the budget on UI  
     UIctrl.displayBudget(budget);
        
    };
   
var ctrlAddItem = function () {
    
    var input , newItem;  
    // 1. Get the feild input data.
   input = UIController.getinput();  
    
    if (input.description !== ""  && !isNaN(input.value) && input.value > 0)  {                   
  //    console.log(input);                
        // 2. Add the item to budget controller 
       newItem = budgetCtrl.addItems(input.type, input.description, input.value);    
    
        // 3. add item to UI       
         UIctrl.addListItem(newItem, input.type); 
    
        // 4. clear the fields
    
      UIctrl.clearFields();
    // 5. Calculate and update budget 
    updateBudget();
    
   }
};
    var ctrlDeleteItem = function(event) {
        var itemID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
            
            
            
        }
        
    };

return {
    init: function() {
        console.log('App has started');
        UIctrl.displayBudget({
               budget:0, 
               totalInc: 0,
               totalExp: 0,
               percentage: -1
           });
        setupEventListeners();
    }
};


})(budgetController,UIController);

controller.init();



