// BUDGET CONTROLLER
var budgetController = (function () {
    
 var Expence = function(id, description, value) {
     this.id = id;
     this.description = description;
     this.value = value;
     this.percentage = -1;
 };
  Expence.prototype.calcPercentage = function(totalIncome) {
      if(totalIncome > 0){ 
      this.percentage = Math.round((this.value / totalIncome)* 100);
      }
      else {
          this.percentage = -1;
      }
  };

    Expence.prototype.getPercentage = function() {
        
        return this.percentage;
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
        
        deleteItem: function(type, id) {
           var ids, index; 
            // id = 3
           //  data.allItems[type][id];
            
            ids =  data.allItems[type].map(function(current) {
              return current.id; 
            });
            
            index = ids.indexOf(id);
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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
        
     calculatePercentages: function() {
         
      data.allItems.exp.forEach(function(cur) {
         cur.calcPercentage(data.totals.inc); 
          
      });
         
     },
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            }); 
            return allPerc;
         
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
        container:'.container',
        expensesPercLabel:'.item__percentage' ,
        dateLabel: '.budget__title--month'
    };
    
   var formatNumber = function(num, type) {
        
       var numSplit,int,dec; 
      /*
      + or - before number
      exectly two decimal points
      comma seprating the thousands
      2310.0987 -> +2,310.00
      2000 -> + 2,000.00
       */  
        num = Math.abs(num);
        num = num.toFixed(2);
        
        numSplit = num.split('.');
        
        int = numSplit[0];
        if(int.length > 3) {
            int = int.substr(0,int.length -3) + ',' + int.substr(int.length -3, 3); // input 2310 ,output 2,310
        }
        
        dec = numSplit[1];
        
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;        
    };
    
     var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
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
     html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
       }
       else if(type === 'exp') {
      element = DOMstrings.expenceContainer;     
      html =  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           }
       
       // Replace the placeholder text with actual date 
       
       newHtml = html.replace('%id%' ,obj.id);
       
       newHtml = newHtml.replace('%description%', obj.description);
       newHtml = newHtml.replace('%value%',formatNumber( obj.value, type));
       
       // INSERT html into the DOM
       document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
       
   },
      
    deleteListItem: function(selectorID) {
        
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
        
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
          var type;
          obj.budget > 0 ? type = 'inc' : type = 'exp';
       
document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);  
document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');  
document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');  
 
          
    if(obj.percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';  
    }  else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '-----';  
    }     
          
      }, 
      
      displayPercentages: function(percentages) {
          var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
           
           nodeListForEach(fields, function(current, index){
               if(percentages[index] > 0){
                  current.textContent = percentages[index] + '%';
               } else {
                   current.textContent = '---';
               }
              
               
           }); 
            
      
          
         },
      
            displayMonth: function() {
            var now, months, month, year;
            
            now = new Date();
            //var christmas = new Date(2016, 11, 25);
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        
        
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            
            nodeListForEach(fields, function(cur) {
               cur.classList.toggle('red-focus'); 
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
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
    document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changedType);
    };
    
    var updateBudget = function() {
        
    // 1. Calculate the budget
        budgetCtrl.calculateBudget();
     // 2. Return the budget 
        var budget = budgetCtrl.getBudget();
                                                     
     // .3 Display the budget on UI  
     UIctrl.displayBudget(budget);
        
    };
    
    var updatePercentages = function () {
    // 1. calculate the percentages
        
        budgetCtrl.calculatePercentages();
        
    // 2. Read percentages from the budget controller
      var percentages = budgetCtrl.getPercentages();
        
    // 3. update the UI with percentages    
        
       UIctrl.displayPercentages(percentages);
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
        
    // 6. calculate and update percentages   
        updatePercentages();
    
   }
};
    var ctrlDeleteItem = function(event) {
        var itemID, splitID,type,ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) { 
            
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]); 
           
            // 1. delete the item from data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from UI
                 UIctrl.deleteListItem(itemID);
            
            // 3. update and show the new budget
            updateBudget();
            
            // 4. calculate and update percentages   
            updatePercentages();
            
        }
        
    };

return {
    init: function() {
        console.log('App has started');
         UIctrl.displayMonth();
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



