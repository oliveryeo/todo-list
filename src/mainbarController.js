import todoController from "./todoController.js";
import { format } from "date-fns";

/* 
  Module pattern that takes in the sidebar tab title and todo array
  and load into main bar view.
*/
const mainbarDisplayHandler = (() => {
  const loadMainbar = () => {
    // Select all tab buttons -> extract title and array -> load mainbar UI
    const allTabButtons = document.querySelectorAll(
      "#home > button, #projects > button"
    );
    allTabButtons.forEach((tabButton) => {
      tabButton.addEventListener("click", () => {
        // Initiate relevant variables
        const tabDataTitle = tabButton.dataset.title;
        let todoArray;
        // Conditions to sieve out todoArray from all tasks, today, next 7 days, or projects
        if (tabDataTitle == "All tasks") {
          todoArray = todoController.extractTodos("All tasks");
        } else if (tabDataTitle == "Today") {
          todoArray = todoController.extractTodos("Today");
        } else if (tabDataTitle == "Next 7 days") {
          todoArray = todoController.extractTodos("Next 7 days");
        } else {
          todoArray = todoController.extractTodos(tabDataTitle);
        }

        _mainbarUIHandler(tabDataTitle, todoArray);
      });
    });

    // Load default mainbar page upon page initialization
    const allTasksTodoArray = todoController.extractTodos("All tasks");
    _mainbarUIHandler("All tasks", allTasksTodoArray);
  };

  function _mainbarUIHandler(tabDataTitle, todoArray) {
    // Select .main-panel-title-content class -> change text content to tabTitle AND set the data-title attribute to tabTitle as well
    const mainPanelTitle = document.querySelector("#main-panel-title-content");
    mainPanelTitle.textContent = tabDataTitle;
    // Select #main-panel-content id:
    const mainPanelContent = document.querySelector("#main-panel-content");
    // Clear out ALL the todos on the page
    mainPanelContent.textContent = "";
    // Using the todoArray, create:
    todoArray.forEach((todo) => {
      // A button with data-todo attribute of the todo title
      const todoButton = document.createElement("button");
      todoButton.dataset.title = todo.title;
      todoButton.dataset.parentProject = todo.parentProject;

      // Checkbox input
      const checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");

      // A div containing the todo title as the content
      const todoTitle = document.createElement("div");
      todoTitle.textContent = todo.title;
      // A div with a class .todo-due-date, inside which contains:
      // An img with the triangle flag
      // A div containing the todo due date as the content
      const todoDueDateContainer = document.createElement("div");
      todoDueDateContainer.classList.add("todo-due-date");
      const dueFlagImg = document.createElement("img");
      dueFlagImg.setAttribute("src", "./icons/flag-triangle.svg");
      const todoDueDate = document.createElement("div");
      todoDueDate.textContent = format(todo.dueDate, "dd MMM");

      todoDueDateContainer.appendChild(dueFlagImg);
      todoDueDateContainer.appendChild(todoDueDate);

      // Joining everything together
      todoButton.appendChild(checkbox);
      todoButton.appendChild(todoTitle);
      todoButton.appendChild(todoDueDateContainer);
      mainPanelContent.appendChild(todoButton);
    });
  }

  return {
    loadMainbar,
  };
})();

/*
  Module Pattern that handles events in mainbar (e.g. title edits, todo edits)
*/
const mainbarEventHandler = (() => {
  const handleTodoCheckboxEvent = () => {
    const todoCheckboxes = document.querySelectorAll("#main-panel-content > button > input[type='checkbox']");

    todoCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('click', (e) => {
        // Get the todo's parentProject name and todoTitle → Extract the todoArray → handle the DOM (e.g. strikethrough, grayed out) and the backend todoArray modification (e.g. deletion)
        const todoButton = checkbox.parentNode;
        const todoTitle = todoButton.dataset.title;
        const todoParentProject = todoButton.dataset.parentProject;
        let isChecked = e.target.checked;
        console.log(todoArray);
        console.log(todoParentProject);

        // If the checkbox is checked, handle all the logic for updating the total tasks for the project
        // Figure out how to refresh all the tasks on the DOM when this is run
        _handleCheckboxDOM(isChecked);
        _handleCheckboxBackend(isChecked, todoArray);

        // Helper function to handle todo DOM changes (e.g. strikethrough)
        function _handleCheckboxDOM(isChecked) {
          // Select all the children nodes of the todoButton
          const buttonElements = todoButton.childNodes;

          // Condition to check if checkbox is checked or not
          if (isChecked) {
            buttonElements.forEach(element => {
              // Strikethrough + gray out
              element.classList.add("todo-checked");
            });
          } else {
            buttonElements.forEach(element => {
              // Remove strikethrough + gray out
              element.classList.remove("todo-checked");
              
            })
          }
        }

        // TODO: Helper function to handle backend logic when a box is checked (e.g. update todos in the project's todoArray)
        function _handleCheckboxBackend(isChecked) {
          // If checked, remove the todo from the project todoArray
          if (isChecked) {
            
          } else {

          }
        }
      })
    })
  };
  
  return {
    handleTodoEvent: handleTodoCheckboxEvent
  }

})();

/*
  Main Module Pattern for export
*/
const mainbarController = (() => {
  const reloadMainbar = () => {
    mainbarDisplayHandler.loadMainbar();
    mainbarEventHandler.handleTodoEvent();
  }

  return {
    reloadMainbar
  }
})();

export default mainbarController;
