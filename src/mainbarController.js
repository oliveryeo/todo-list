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

    _mainbarTitleHandler("All tasks");
    _mainbarTodoHandler(allTasksTodoArray);

    // Style the button as "selected"
    const allTasksButton = document.querySelector("button[data-title='All tasks']");
    allTasksButton.classList.add("selected-tab");
  };

  const reloadMainbarTodo = (projectTitle) => {
    const projectTodoArray = todoController.extractTodos(projectTitle);
    _mainbarTodoHandler(projectTodoArray);
  }

  // Whenever a side tab is clicked, load the mainbar display.
  const loadMainbarEvents = () => {
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

        _mainbarTitleHandler(tabDataTitle);
        _mainbarTodoHandler(todoArray);
      });
    });
  };

  function _mainbarTitleHandler(tabDataTitle) {
    // Select .main-panel-title-content class -> change text content to tabTitle AND set the data-title attribute to tabTitle as well
    const mainPanelTitle = document.querySelector("#main-panel-title-content");
    mainPanelTitle.textContent = tabDataTitle;
    mainPanelTitle.dataset.title = tabDataTitle;

    // Display the editor icons only if a project is selected
    if (tabDataTitle != "All tasks" && tabDataTitle != "Today" && tabDataTitle != "Next 7 days") {
      const mainPanelEditorContainer = document.querySelector("#main-panel-title-editor");
      mainPanelEditorContainer.textContent = "";

      const mainPanelEditIcon = document.createElement("img");
      mainPanelEditIcon.src = "./icons/square-edit-outline.svg";
      mainPanelEditIcon.setAttribute("id", "edit-icon");

      const mainPanelTrashIcon = document.createElement("img");
      mainPanelTrashIcon.src = "./icons/trash-can-outline.svg";
      mainPanelTrashIcon.setAttribute("id", "trash-icon");

      mainPanelEditorContainer.appendChild(mainPanelEditIcon);
      mainPanelEditorContainer.appendChild(mainPanelTrashIcon);
    } else {
      // Do not display any editor for the "All tasks", "Today" and "Next 7 days"
      const mainPanelEditorContainer = document.querySelector("#main-panel-title-editor");
      mainPanelEditorContainer.textContent = "";
    }
  }

  function _mainbarTodoHandler(todoArray) {
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
    loadMainbarEvents,
    reloadMainbarTodo,
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
  
  // When a checkbox is clicked, RELOAD all the tasks count in the sidebar
  const handleDynamicTodoCount = () => {
    const todoCheckboxes = document.querySelectorAll("#main-panel-content > button > input[type='checkbox']");

    todoCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('click', () => {
        const todoButton = checkbox.parentNode;
        const todoParentProject = todoButton.dataset.parentProject;

        // Reload ALL the tasks count
        sidebarController.todoCountLoader.loadAllTasksCount();
        sidebarController.todoCountLoader.loadTodayTasksCount();
        sidebarController.todoCountLoader.loadWeekTasksCount();
        sidebarController.todoCountLoader.loadProjectTasksCount(todoParentProject);
      })
    });
  };

  // Handle logic for project title editing
  const handleProjectTitleEdit = () => {
    // Select the edit icon
    const projectTitleEditIcon = document.querySelector("#edit-icon");
    
    // If the icon exists, listen for clicks and create the Input 
    if (projectTitleEditIcon) {
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
        inputField.addEventListener('keyup', inputFieldEventHandler);
  
        // Create a condition when the user clicks away from the inputField or the projectTitleEditIcon, the projectTitle and backend is updated immediately. windowEventHandler function have to be defined because the eventListener needs to be removed after the code is run.
        window.addEventListener('click', windowEventHandler);
  
        function inputFieldEventHandler(e) {
          if (e.key == "Enter") {
            // If the project does not exist AND its not the same project name, update DOM and backend.
            if (projectAlreadyExists() == false) {
              _handleNewProjectTitleBackend();
              _handleNewProjectTitleDOM();
            }
            
            inputField.remove();
            projectTitleEditIcon.addEventListener('click', createProjectTitleEditInput);
            window.removeEventListener('click', windowEventHandler);
          }
        }
  
        function windowEventHandler(e) {
          // If user clicks away from the inputField OR the projectTitleEditIcon, update the inputField
          if (e.target != inputField && e.target != projectTitleEditIcon) {
            console.log("update!");
            // If the project does not exist AND its not the same project name, update DOM and backend.
            if (projectAlreadyExists() == false) {
              _handleNewProjectTitleBackend();
              _handleNewProjectTitleDOM();
            }

            inputField.remove();
            projectTitleEditIcon.addEventListener('click', createProjectTitleEditInput);
            window.removeEventListener('click', windowEventHandler);
          }
        }

        function projectAlreadyExists() {
          const oldProjectTitle = projectTitleContentDiv.dataset.title;
          const newProjectTitle = inputField.value;
          const allProjects = todoController.allProjects;

          // Loop through all project to see if the project name already exists
          for (let i = 0; i < allProjects.length; i++) {
            if (allProjects[i].projectName == newProjectTitle) {
              if (newProjectTitle == oldProjectTitle) {
                return true;
              } else {
                alert(`${newProjectTitle} already exists!`);
              return true;
              }
            }
          }
          // Return false if it does not exist
          return false;
        }

        // Change the project title in todoController
        function _handleNewProjectTitleBackend() {
          const oldProjectTitle = projectTitleContentDiv.dataset.title;
          const newProjectTitle = inputField.value;
          const allProjects = todoController.allProjects;

          // If the code reaches here, means the project does not exist in the database. Update the project name accordingly.
          console.log("Update new project name in backend");
          for (let i = 0; i < allProjects.length; i++) {
            if (allProjects[i].projectName == oldProjectTitle) {
              // Change project title
              allProjects[i].projectName = newProjectTitle;

              // Change each todo's parent project name
              const todoArray = todoController.extractTodos(allProjects[i].projectName);
              todoArray.forEach(todo => {
                todo.parentProject = newProjectTitle;
              });
            }
          }
        }

        // Change the project title
        function _handleNewProjectTitleDOM() {
          const newProjectTitle = inputField.value;

          console.log("Change DOM title");
          projectTitleContentDiv.textContent = newProjectTitle;
          projectTitleContentDiv.dataset.title = newProjectTitle;

          // Refresh all the todos on the page AND the event handlers
          mainbarDisplayHandler.reloadMainbarTodo(newProjectTitle);
          mainbarEventHandler.handleTodoCheckboxEvent();
          mainbarEventHandler.handleDynamicTodoCount();

          // Refresh the sidebar once everything is handled
          sidebarController.projectController.projectDisplayReloader();
        }
      }
    }
  };


  // Handle logic for deleting a project
  const handleProjectDeletion = () => {
    // Run event handler if trash icon exists
    const projectTrashIcon = document.querySelector("#trash-icon");

    if (projectTrashIcon) {
      projectTrashIcon.addEventListener('click', handleProjectDeletion);
    }

    function handleProjectDeletion() {
      // Alert a confirmatory message (yes or no)
      const confirmDelete = confirm("Are you sure you want to delete this project?");
      
      if (confirmDelete) {
        // Handle backend changes
        _handleProjectDeletionBackend();
        
        // Handle DOM changes
        _handleProjectDeletionDOM();
      }
      

        function _handleProjectDeletionBackend() {
          const projectTitleContentDiv = document.querySelector("#main-panel-title-content");
          const projectTitle = projectTitleContentDiv.dataset.title;
          // Use a delete project function from todoController
          todoController.deleteProject(projectTitle);
        }

        function _handleProjectDeletionDOM() {
          // Reload all the tasks in the sidebar home tab
          sidebarController.todoCountLoader.loadAllTasksCount();
          sidebarController.todoCountLoader.loadTodayTasksCount();
          sidebarController.todoCountLoader.loadWeekTasksCount();
          
          // Reload sidebar project displays
          sidebarController.projectController.projectDisplayReloader();

          // Load mainbar to all tasks
          mainbarDisplayHandler.loadDefaultMainbar();
      }
    }
  }
  
  // TODO: Handle logic for todo information editing
  const handleTodoInfoEdit = () => {

  };

  // TODO: Handle logic for deleting a todo
  const handleTodoDeletionEvent = () => {

  }

  return {
    handleTodoCheckboxEvent,
    handleDynamicTodoCount,
    handleProjectTitleEdit,
    handleProjectDeletion
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
