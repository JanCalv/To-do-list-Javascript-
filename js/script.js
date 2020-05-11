var listController = (function(){

    // Constructor for the input value 
    var Items = function(id,description){
        this.id = id;
        this.description = description;
    }

    var data = {
        desc: []
    }

    var nodeListForEach = function(list, callback) {
        for(i = 0; i < list.length; i++){
            callback(list[i],i)
        }
    }

    return {
        getItems: function(desc){
            var ID;

            if (data.desc.length > 0) {
                ID = data.desc[data.desc.length - 1].id + 1;
            } else {
                ID = 0;
            }
                  
            newItem = new Items(ID, desc)
            data.desc.push(newItem);

            return newItem;
        },

        
        removeItem: function(listID){
            var arrMap, index;
            arrMap = data.desc.map(function(cur){
                return cur.id
            })
            
            index = arrMap.indexOf(listID)
            // console.log(arrMap)
            // console.log(listID)

            if  (index !== -1) {
                data.desc.splice(index, 1)
            }
            
        },

        completeItem: function(taskID, desc){
            var arrMap, index;

            arrMap = data.desc.map(function(cur){
                return cur.id
            })
              
            index = arrMap.indexOf(taskID)

            if  (index !== -1) {
                document.getElementById('list-'+taskID).classList.toggle('completed');
            }
        },


        test: function(){
            console.log(data.desc)
        }
    }

})();



var UIController = (function(){

    var DOMstrings = {
        addButton: '.add-btn',
        toDoDescription: '.text-box',
        listContainer: '.list-content',
        day: '.day',
        date: '.date-time'
    };

    var nodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i],i);
        }
    }
    
    return {

        getToDoItem: function(){
            return {
                description: document.querySelector(DOMstrings.toDoDescription).value
            }
        },

        displayItems: function(obj){
            var html, newhtml, element;

            element = document.querySelector(DOMstrings.listContainer);

            html = '<div class="list" id = "list-%id%"> <i class="fa fa-check-square fa-2x"></i><h2 class="list-description">%description%</h2><div class="btns"><i class="fas fa-minus-circle fa-2x "></i></div>  </div>'

            newhtml = html.replace('%id%', obj.id);
            newhtml = newhtml.replace('%description%', obj.description);

            element.insertAdjacentHTML('beforeend', newhtml)         
        },

        deleteDisplayItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el)
        },

        clearField: function(){
            var textBox;

            textBox = document.querySelector(DOMstrings.toDoDescription);

            textBox.value = "";

            // arrTextBox = Array.prototype.slice.call(textBox);

            // arrTextBox.forEach(function(curr){
            //     curr.value = ""
            // })
        },

        displayDay: function(){
            var d, day, date, month, months, weekday, year;

            weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            d = new Date();
            
            day = weekday[d.getDay()];
            date = d.getDate();
            month = d.getMonth();
            year = d.getFullYear();


            document.querySelector(DOMstrings.day).textContent = day;
            document.querySelector(DOMstrings.date).textContent = date + " / " + months[month] + " / " +year;
            
        },

        getDOMstring: function(){
            return DOMstrings
        }
    }
})();






var appController = (function(listCtrl, UICtrl){

    var setUpEventListener = function() {
        // 1. Get DOM classes
        var DOM = UICtrl.getDOMstring();
        // 2. Set up event listener to click and keypress enter
        document.querySelector(DOM.addButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        // Event Delegation (delete item)
        document.querySelector(DOM.listContainer).addEventListener('click', ctrlDeleteItem)

        // Event Delegation (complete Item)
        document.querySelector(DOM.listContainer).addEventListener('click', ctrlCompleteTask)
    };

    var nodeListForEach = function(list, callback) {
        for(i = 0; i < list.length; i++){
            callback(list[i],i)
        }
    }

    var displayDay = function(){
        // 1. Display day
        UICtrl.displayDay();
    }
        
    var ctrlAddItem = function() {
        // 1. Get Inputed value
        var input = UICtrl.getToDoItem();
        
        if(input.description !== ""){
            // 2. Store all the to do items into array
            var newItems = listCtrl.getItems(input.description);

            // 3. Display it to the UI
            UICtrl.displayItems(newItems);

            // 4. Clear input fields
            UICtrl.clearField();
        }
    };

    var ctrlCompleteTask = function(event){

        var element, completeID, splitID;

        element = event.target.parentNode.id;
            
        if(element){
            splitID = element.split('-');
            completeID = parseInt(splitID[1])

            // 1. Select it from the data structure
            listCtrl.completeItem(completeID);
            // 2. Disable the selected from the UI
        }
    }


    var ctrlDeleteItem = function(event){
        // Event Traversing
        var element, elementId;
        element = event.target.parentNode.parentNode.id;

        // if the 'element' has already appeared
        if(element) {
            splitID = element.split('-');
            elementId = parseInt(splitID[1]);

            // 1. Delete the item from the list Controller or Data Structure
            listController.removeItem(elementId)

            // 2. Delete the Item from the UI
            UICtrl.deleteDisplayItem(element);
        
        }
      
    }
    
    return {
        init: function(){
            setUpEventListener();
            displayDay();
        }
    }

})(listController, UIController);

appController.init();