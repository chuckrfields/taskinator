//The DOM (Document Object Model) is an API for HTML documents, which is organized by the DOM node tree, or DOM tree. This hierarchy is based on parent-child relationships.
//console.log(window.document);
/*
    The DOM is the data representation of the objects that comprise the structure and content of a document on the web.

    HTML isn't the DOM. HTML is a structured text language. The DOM is a parsed version of HTML, that can be manipulated with JavaScript.
*/
// console.dir(window.document); //displays HTML element as an object, known as a DOM element (versus running console.log(window.document); )

//document.querySelector("button");
/*
In console, this displays the button object:
    var btn = document.querySelector("button");
    console.dir(btn);

    document.querySelector("button").textContent; //displays text from button
    document.querySelector("#save-task"); //gets item by id (use . for class, just like CSS)
*/

/*
EVENTS: We refer to the observation of the event as the event listener. And we refer to the response to the event as the event handler.

in console type:
    buttonEl.addEventListener("click", function() { alert("button clicked"); });

    Here we've used an anonymous function that uses the window method alert()
    When you pass a function into a function, it is called a callback function.
    A callback is a function passed as an argument to another function

    setInterval: executes callback repeatedly at a set interval
    setTimeout: executes the callback after a set delay
*/

// var buttonEl = document.querySelector("#save-task"); //captures "click" event only, not the Enter key
var taskIdCounter = 0;
var formEL = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEL = document.querySelector("#tasks-in-progress");
var tasksCompleteEl = document.querySelector("#tasks-completed");
var tasks = [];

// Add event listener to main section
var pageContentEL = document.querySelector("#page-content");

var taskButtonHandler = function(event) {
    // console.log(event.target);

    // get target element from event
    var targetEL = event.target;

    // edit button was clicked
    if (event.target.matches(".edit-btn")) {
        var taskId = targetEL.getAttribute("data-task-id");
        editTask(taskId);
    }

    else if (event.target.matches(".delete-btn")) {
        var taskId = targetEL.getAttribute("data-task-id");
        deleteTask(taskId);
    }
}

pageContentEL.addEventListener("click", taskButtonHandler);

//Place callback function BEFORE button's addEventListener!
var taskFormHandler = function(event) {
    // console.log(event);
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;  //Use square brackets to select an HTML element by one of its attributes
    // console.log(taskNameInput);
    // console.dir(taskNameInput);  // Use DIR to Display data as a JavaScript object
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    // console.log(taskTypeInput);

    // Validate: Check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {  //Empty strings and the number 0 are evaluated as FALSY values, So with ! we're checking to see if either are falsy
        // So, this code literally says, "if either one or both of the variables are not true, then proceed," which is the same as "if either one or both of the variables are false, then proceed."
        alert("You need to fill out the task form!");
        return false;
    }

    // reset form since values are saved in variables
    formEL.reset();

    var isEdit = formEL.hasAttribute("data-task-id");

    // has data attribute, so get task is and call function to completed edit 
    if (isEdit) {
        var taskId = formEL.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object and pass to createTaskEL  function
    else {
         // package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        }
        
        // send object as an argument to createTaskEl
        createTaskEl(taskDataObj);
    } 
}

var createTaskEl = function(taskDataObj) {
  // create list item
  var listItemEL = document.createElement("li");
  listItemEL.className = "task-item";

  // add task id as a custom attribute
  listItemEL.setAttribute("data-task-id", taskIdCounter);

  //Create div to hold task info and add to list item
  var taskInfoEL = document.createElement("div");
  // give it a class name
  taskInfoEL.className = "task-info";
  // add HTML content to div
  taskInfoEL.innerHTML = "<h3 class ='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

  listItemEL.appendChild(taskInfoEL);

  // create drop down
  var taskActionsEL = createTaskActions(taskIdCounter);
  listItemEL.appendChild(taskActionsEL);

    switch(taskDataObj.status) {
        case 'to do':
            listItemEL.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEL);
            break;
        case 'in progress':
            listItemEL.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEL.appendChild(listItemEL);
            break;
        case 'completed':
            listItemEL.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompleteEl.appendChild(listItemEL);
            break;
        default: 
            console.log("Cannot get status!");            
}

  // update taskDataObj with id and push to array ('push' adds to end of array for new tasks)
  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);
  saveTasks();

  // increase task counter for next unique id
  taskIdCounter++;

  // console.dir(listItemEL);
}

var createTaskActions = function(taskId)  {
    var actionContainerEL = document.createElement("div");
    actionContainerEL.className = "task-actions";

    // create edit button
    var editButtonEL = document.createElement("button");
    editButtonEL.textContent = "Edit";
    editButtonEL.className = "btn edit-btn";
    editButtonEL.setAttribute("data-task-id", taskId);

    actionContainerEL.appendChild(editButtonEL);

    // create delete button
    var deleteButtonEL = document.createElement("button");
    deleteButtonEL.textContent = "Delete";
    deleteButtonEL.className = "btn delete-btn";
    deleteButtonEL.setAttribute("data-task-id", taskId);

    actionContainerEL.appendChild(deleteButtonEL);

    // create dropdown
    var statusSelectEL = document.createElement("select");
    statusSelectEL.className = "select-status";
    statusSelectEL.setAttribute("name", "status-change");
    statusSelectEL.setAttribute("data-task-id", taskId);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEL = document.createElement("option");
        statusOptionEL.textContent = statusChoices[i];
        statusOptionEL.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEL.appendChild(statusOptionEL);
    }

    actionContainerEL.appendChild(statusSelectEL);

     return actionContainerEL;
};

var deleteTask = function(taskId) {
    /*
        notice that there's no space between the .task-item and the [data-task-id] attribute, which means that both properties must be on the same element; 
        a space would look for a element with the [data-task-id] attribute somewhere inside a .task-item element.
    */
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    // console.log(taskSelected);

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks id doesn't match the value of taskId, keep the task
        if (tasks[i].id === parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    };

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    saveTasks();
}

var editTask = function(taskId) {
    // console.log("editing task #" + taskId);

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEL.setAttribute("data-task-id", taskId);
}

var completeEditTask = function(taskName, taskType, taskId) {
    // console.log(taskName, taskType, taskId);
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    saveTasks();

    alert("Task Updated!");

    formEL.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

var taskStatusChangeHandler = function(event) {
    // console.log(event.target);
    // get the task item id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selection option value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEL.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompleteEl.appendChild(taskSelected);
    }

    // update task in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    };

    saveTasks();
}

var saveTasks = function() {
    // JSON - JavaScript Object Notation 
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function () {
    // Gets task items from localStorage.
    var savedTasks = localStorage.getItem("tasks");
    // console.log(tasks);

    if (!savedTasks){ //tasks is null
        savedTasks = [];
        return false;
    }

    // Converts tasks from the string format back into an array of objects.
    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into the 'createTaskEl()' function
        createTaskEl(savedTasks[i]);
    }

    // console.log(tasks);

    // // Iterates through a tasks array and creates task elements on the page from it.
    // for (var i = 0; i < tasks.length; i++) {
    //     tasks[i].id = taskIdCounter;

    //     var listItemEL = document.createElement("li");
    //     listItemEL.className = "task-item";

    //     // add task id as a custom attribute
    //     listItemEL.setAttribute("data-task-id", tasks[i].id);

    //     var taskInfoEL = document.createElement("div");
    //     taskInfoEL.className = "task-info"
    //     taskInfoEL.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";

    //     listItemEL.appendChild(taskInfoEL);

    //     var taskActionsEL = createTaskActions(tasks[i].id);
    //     listItemEL.appendChild(taskActionsEL);

    //     if (tasks[i].status === "to do") {
    //         listItemEL.querySelector("select[name='status-change']").selectedIndex = 0;
    //         tasksToDoEl.appendChild(listItemEL);
    //     }
    //     else if (tasks[i].status === "in progress") {
    //         listItemEL.querySelector("select[name='status-change']").selectedIndex = 1;
    //         tasksInProgressEL.appendChild(listItemEL);
    //     }
    //     else if (tasks[i].status === "completed") {
    //         listItemEL.querySelector("select[name='status-change']").selectedIndex = 2;
    //         tasksCompleteEl.appendChild(listItemEL);
    //     }

    //     taskIdCounter++;

    //     console.log(listItemEL);
    // }
}

formEL.addEventListener("submit", taskFormHandler);  //Captures the "submit" event within the form; the button type is "submit"; also the Enter key

pageContentEL.addEventListener("change", taskStatusChangeHandler);

loadTasks();


