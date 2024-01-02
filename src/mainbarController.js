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

      // An input of checkbox type
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
        console.log(e);

        // If the checkbox is checked, handle all the logic for updating the total tasks for the project
        // Figure out how to refresh all the tasks on the DOM when this is run
        if (e.target.checked == true) {
          console.log("hell yeah");

          // TODO: Have to find out how to get the specific button information (e.g. data title) -> then get the project name -> then access the project's todoArray database via todoController.extractTodos
          const projectTitle = document.querySelector("#main-panel-title-content");
          const projectTitleContent = projectTitle.textContent;
          
          const todoArray = todoController.extractTodos(projectTitleContent);
          const todoButton = checkbox.parentNode;
          const todoTitle = todoButton.dataset.title;
          console.log(todoArray);

          // Using the parentProject attribute in a todo factory function object, whenever a task is checked in a home tab, update the todoArray in the specific parentProject as well as the task count.


          // TODO: Helper function to handle todo DOM changes (e.g. strikethrough)
          function _handleCheckedDOM() {

          }

          // TODO: Helper function to handle backend logic when a box is checked (e.g. update todos in the project's todoArray)
          function _handleCheckedBackend(todoArray) {

          }

        } else if (e.target.checked == false) {
          console.log("hell nah");

          // TODO: Have to find out how to return the todo back into the project's array, if it is already not in the array.
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
