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

    // package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    // send object as an argument to createTaskEl
    createTaskEl(taskDataObj);
  
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

  // add entire list item to list
  tasksToDoEl.appendChild(listItemEL);

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

formEL.addEventListener("submit", taskFormHandler);  //Captures the "submit" event within the form; the button type is "submit"; also the Enter key





