import todoController from "./todoController.js";
import sidebarController from "./sidebarController.js";
import { format } from "date-fns";

/* 
  Module pattern that takes in the sidebar tab title and todo array
  and load into main bar view.
*/
const mainbarDisplayHandler = (() => {
  // Set the default intitial mainbar page load to "All tasks"
  const loadDefaultMainbar = () => {
    const allTasksTodoArray = todoController.extractTodos("All tasks");
    _mainbarUIHandler("All tasks", allTasksTodoArray);
  };

  // Whenever a side tab is clicked, load the mainbar display.
  const loadMainbar = () => {
    // Select all tab buttons -> extract title and array -> load mainbar UI
    const sidebarTabs = document.querySelectorAll(
      "#home > button, #projects > button"
    );
    sidebarTabs.forEach((tabButton) => {
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
  };

  // Helper function for DOM loading of project title and todo loading in the mainbar display
  function _mainbarUIHandler(tabDataTitle, todoArray) {
    // Select .main-panel-title-content class -> change text content to tabTitle AND set the data-title attribute to tabTitle as well
    const mainPanelTitle = document.querySelector("#main-panel-title-content");
    mainPanelTitle.textContent = tabDataTitle;
    mainPanelTitle.dataset.title = tabDataTitle;
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
    loadDefaultMainbar
  };
})();

/*
  Module Pattern that handles events in mainbar (e.g. title edits, todo edits)
*/
const mainbarEventHandler = (() => {
  // Handles the mainbar DOM changes (e.g. todo strikethrough) and the backend todoController changes (changing the isChecked boolean) when a todo checkbox is checked.
  const handleTodoCheckboxEvent = () => {
    const todoCheckboxes = document.querySelectorAll("#main-panel-content > button > input[type='checkbox']");

    todoCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('click', (e) => {
        // Get the todo's parentProject name and todoTitle → Extract the todoArray → handle the DOM (e.g. strikethrough, grayed out) and the backend todoArray modification (e.g. deletion)
        const todoButton = checkbox.parentNode;
        const todoTitle = todoButton.dataset.title;
        const todoParentProject = todoButton.dataset.parentProject;
        const todoArray = todoController.extractTodos(todoParentProject);
        let isCheckboxChecked = e.target.checked;
          // console.log(todoArray);
          // console.log(todoParentProject);

        // If the checkbox is checked, handle all the logic for updating the total tasks for the project
        // Figure out how to refresh all the tasks on the DOM when this is run
        _handleCheckboxDOM(isCheckboxChecked);
        _handleCheckboxBackend(isCheckboxChecked, todoArray);

        // Helper function to handle todo DOM changes (e.g. strikethrough)
        function _handleCheckboxDOM(isCheckboxChecked) {
          // Select all the children nodes of the todoButton
          const buttonElements = todoButton.childNodes;

          // Condition to check if checkbox is checked or not
          if (isCheckboxChecked) {
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

        // Helper function to handle backend logic when a box is checked (e.g. update todos in the project's todoArray)
        function _handleCheckboxBackend(isCheckboxChecked) {
          // Find the associated todo and update the todoIsChecked boolean. Change todo's isChecked status depending if the checkbox is checked.
          todoArray.forEach(todo => {
            if (todo.title == todoTitle) {
              if (isCheckboxChecked) {
                todo.isChecked = true;
              } else {
                todo.isChecked = false;
              }
            }
          })
        }
      })
    })
  };
  
  // TODO: Handle logic for project title editing
  const handleProjectTitleEdit = () => {
    // Select the edit icon
    const projectTitleEditIcon = document.querySelector("#edit-icon");
    // Listen for clicks and create the Input
    projectTitleEditIcon.addEventListener('click', createProjectTitleEditInput);

    function createProjectTitleEditInput() {
      const projectTitleContainerDiv = document.querySelector("#main-panel-title-container");
      const projectTitleContentDiv = document.querySelector("#main-panel-title-content");
      
      // Remove event listener on edit icon
      projectTitleEditIcon.removeEventListener('click', createProjectTitleEditInput);
      // Create and add an input field (similar to new projects) for title edit
      const inputField = document.createElement("input");
      inputField.classList.add("main-panel-edit-title-input");
      inputField.setAttribute("type", "text");
      inputField.setAttribute("value", projectTitleContentDiv.textContent); // Show default title name for editing
      
      // Append the inputField and Focus the input at the END of the input default value content (a.k.a the end of projectTitle)
      projectTitleContainerDiv.appendChild(inputField);
      inputField.focus();
      const inputFieldLength = projectTitleContentDiv.textContent.length;
      inputField.setSelectionRange(inputFieldLength, inputFieldLength);

      // Create a condition where if the user enters "Enter", update the projectTitle and backend immediately. Also remove window eventListener to prevent duplicate action.
      inputField.addEventListener('keyup', (e) => {
        if (e.key == "Enter") {
          // Handle backend first, then DOM because sidebarcontroller.refreshProjectDisplay() is used
          _handleNewProjectTitleBackend();
          _handleNewProjectTitleDOM();
          inputField.remove();
          projectTitleEditIcon.addEventListener('click', createProjectTitleEditInput);
          window.removeEventListener('click', windowEventHandler);
        }
      });

      // Create a condition when the user clicks away from the inputField or the projectTitleEditIcon, the projectTitle and backend is updated immediately. windowEventHandler function have to be defined because the eventListener needs to be removed after the code is run.
      window.addEventListener('click', windowEventHandler);

      function windowEventHandler(e) {
        // If user clicks away from the inputField OR the projectTitleEditIcon, update the inputField
        if (e.target != inputField && e.target != projectTitleEditIcon) {
          console.log("update!");
          // Handle backend first, then DOM because sidebarcontroller.refreshProjectDisplay() is used
          _handleNewProjectTitleBackend();
          _handleNewProjectTitleDOM();
          inputField.remove();
          projectTitleEditIcon.addEventListener('click', createProjectTitleEditInput);
          window.removeEventListener('click', windowEventHandler);
        }
      }

      // Change the project title
      function _handleNewProjectTitleDOM() {
        // Change mainbar title name and data-title
        const newProjectTitle = inputField.value;
        projectTitleContentDiv.textContent = newProjectTitle;
        projectTitleContentDiv.dataset.title = newProjectTitle;
        
        // Refresh the sidebar
        sidebarController.projectController.projectDisplayReloader();
      }

      // Change the project title in todoController
      function _handleNewProjectTitleBackend() {
        const oldProjectTitle = projectTitleContentDiv.dataset.title;
        const newProjectTitle = inputField.value;
        const allProjects = todoController.allProjects;

        for (let i = 0; i < allProjects.length; i++) {
          if (allProjects[i].projectName == oldProjectTitle) {
            allProjects[i].projectName = newProjectTitle;
          }
        }
      }
    }
  };

  // TODO: Handle logic for deleting a project
  const handleProjectDeletionEvent = () => {

  }
  
  // TODO: Handle logic for todo information editing
  const handleTodoInfoEdit = () => {

  };

  // TODO: Handle logic for deleting a todo
  const handleTodoDeletionEvent = () => {

  }

  return {
    handleTodoCheckboxEvent,
    handleProjectTitleEdit
  }

})();

/*
  Main Module Pattern for export
*/
const mainbarController = (() => {
  return {
    mainbarDisplayHandler,
    mainbarEventHandler
  }
})();

export default mainbarController;
