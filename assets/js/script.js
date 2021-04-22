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

var formEL = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

//Place callback function BEFORE button's addEventListener!
var createTaskHandler = function(event) {
    // console.log(event);
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;  //Use square brackets to select an HTML element by one of its attributes
    // console.log(taskNameInput);
    // console.dir(taskNameInput);  // Use DIR to Display data as a JavaScript object
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    // console.log(taskTypeInput);

    // create list item
    var listItemEL = document.createElement("li");
    listItemEL.className = "task-item";

    //Create div to hold task info and add to list item
    var taskInfoEL = document.createElement("div");
    // give it a class name
    taskInfoEL.className = "task-info";
    // add HTML content to div
    taskInfoEL.innerHTML = "<h3 class ='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>";

    listItemEL.appendChild(taskInfoEL);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEL);

    // console.dir(listItemEL);
}

formEL.addEventListener("submit", createTaskHandler);  //Captures the "submit" event within the form; the button type is "submit"; also the Enter key





