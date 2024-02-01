import todoController from "./todoController.js";
import sidebarController from "./sidebarController.js";
import { format } from "date-fns";
import editIconImg from "./icons/square-edit-outline.svg";
import trashIconImg from "./icons/trash-can-outline.svg";
import highPriorityImg from "./icons/high-priority.svg";
import medPriorityImg from "./icons/med-priority.svg";
import lowPriorityImg from "./icons/low-priority.svg";
import deadlineIconImg from "./icons/flag-triangle.svg";

/**
 * Module pattern that takes in the sidebar tab title and todo array
 * and load into main bar view.
 */
const mainbarDisplayHandler = (() => {
  /**
   * Load "All tasks as the default mainbar"
   */
  const loadDefaultMainbarDisplay = () => {
    const allTasksTodoArray = todoController.extractTodos("All tasks");

    _mainbarTitleHandler("All tasks");
    _mainbarTodoHandler(allTasksTodoArray);

    // Style the button as "selected"
    const allTasksButton = document.querySelector("button[data-title='All tasks']");
    allTasksButton.classList.add("selected-tab");
  };

  const reloadMainbarTodo = (tabTitle) => {
    const projectTodoArray = todoController.extractTodos(tabTitle);
    _mainbarTodoHandler(projectTodoArray);
  }
  
  /**
   * Add event listeners to side tab to load mainbar display upon clicking
   */
  const loadMainbarDisplayEvents = () => {
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

  /**
   * Helper function to load mainbar title DOM
   */
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
      mainPanelEditIcon.src = editIconImg;
      mainPanelEditIcon.setAttribute("id", "edit-icon");

      const mainPanelTrashIcon = document.createElement("img");
      mainPanelTrashIcon.src = trashIconImg;
      mainPanelTrashIcon.setAttribute("id", "trash-icon");

      mainPanelEditorContainer.appendChild(mainPanelEditIcon);
      mainPanelEditorContainer.appendChild(mainPanelTrashIcon);
    } else {
      // Do not display any editor for the "All tasks", "Today" and "Next 7 days"
      const mainPanelEditorContainer = document.querySelector("#main-panel-title-editor");
      mainPanelEditorContainer.textContent = "";
    }
  }

  /**
   * Helper function to load mainbar todo DOM
   */
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
      const todoPriority = document.createElement("img");
      if (todo.priority == "high") {
        todoPriority.setAttribute("src", highPriorityImg);
      } else if (todo.priority == "medium") {
        todoPriority.setAttribute("src", medPriorityImg);
      } else {
        todoPriority.setAttribute("src", lowPriorityImg);
      }
      const dueFlagImg = document.createElement("img");
      dueFlagImg.setAttribute("src", deadlineIconImg);
      const todoDueDate = document.createElement("div");
      todoDueDate.textContent = format(todo.dueDate, "dd MMM");

      todoDueDateContainer.appendChild(todoPriority);
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
    loadMainbarDisplayEvents,
    reloadMainbarTodo,
    loadDefaultMainbarDisplay
  };
})();

/**
 * Module Pattern that handles events in mainbar (e.g. title edits, todo edits)
 */
const mainbarEventHandler = (() => {
  /**
   * Handles the mainbar DOM changes (e.g. todo strikethrough) and the backend todoController changes (changing the isChecked boolean) when a todo checkbox is checked.
   */
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

        /*
          Helper function to handle todo DOM changes (e.g. strikethrough)
        */ 
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

        /*
          Helper function to handle backend logic when a box is checked (e.g. update todos in the project's todoArray)
        */ 
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
  
  /**
   * Reload all the tasks count in the sidebar when a checkbox is clicked
   */
  const handleDynamicTodoCount = () => {
    const todoCheckboxes = document.querySelectorAll("#main-panel-content > button > input[type='checkbox']");

    todoCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('click', () => {
        const todoButton = checkbox.parentNode;
        const todoParentProject = todoButton.dataset.parentProject;

        // Reload ALL the tasks count
        sidebarController.todoCountLoader.loadAllTaskCount();
        sidebarController.todoCountLoader.loadTodayTaskCount();
        sidebarController.todoCountLoader.loadWeekTaskCount();
        sidebarController.todoCountLoader.loadProjectTaskCount(todoParentProject);
      })
    });
  };

  /**
   * Handle logic for project title editing when the edit icon is clicked
   */
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
        
        /* 
          Function to handle inputFieldEvent
        */
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
  
        /* 
          Function to handle windowEvent
        */
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

        /* 
          Function that returns true or false if the project already exists
        */
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

        /* 
          Helper Function that change the project title in the backend todoController
        */
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

        /* 
          Helper function that handles the DOM changes when changing the project title
        */
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

  /**
   * Handle logic for project deletion when the trash icon is clicked
   */
  const handleProjectDeletion = () => {
    // Run event handler if trash icon exists
    const projectTrashIcon = document.querySelector("#trash-icon");

    if (projectTrashIcon) {
      projectTrashIcon.addEventListener('click', handleProjectDeletion);
    }

    /* 
      Function that handles logic for project deletion
    */
    function handleProjectDeletion() {
      // Alert a confirmatory message (yes or no)
      const confirmDelete = confirm("Are you sure you want to delete this project?");
      
      if (confirmDelete) {
        // Handle backend changes
        _handleProjectDeletionBackend();
        
        // Handle DOM changes
        _handleProjectDeletionDOM();
      }
      
        /* 
          Helper function that handles backend logic for project deletion in todoController
        */
        function _handleProjectDeletionBackend() {
          const projectTitleContentDiv = document.querySelector("#main-panel-title-content");
          const projectTitle = projectTitleContentDiv.dataset.title;
          // Use a delete project function from todoController
          todoController.deleteProject(projectTitle);
        }
        
        /* 
          Helper function that handles DOM logic for project deletion
        */
        function _handleProjectDeletionDOM() {
          // Reload all the tasks in the sidebar home tab
          sidebarController.todoCountLoader.loadAllTaskCount();
          sidebarController.todoCountLoader.loadTodayTaskCount();
          sidebarController.todoCountLoader.loadWeekTaskCount();
          
          // Reload sidebar project displays
          sidebarController.projectController.projectDisplayReloader();

          // Load mainbar to all tasks
          mainbarDisplayHandler.loadDefaultMainbarDisplay();
      }
    }
  }
  
  /**
   * Handle logic for todo information editing
   */
  const handleTodoInfoEdit = () => {
    // Select all todo buttons
    const todoButtons = document.querySelectorAll("#main-panel-content > button");

    // Handle single click events
    todoButtons.forEach(button => {
      button.addEventListener("click", handleSingleClick);

      /**
       * A function that handles what happens when the button gets clicked
       */
      function handleSingleClick(e) {
        if (e.target.computedRole != "checkbox") {
          const prevSelectedTodo = document.querySelector("#main-panel-content > button.selected-tab");
          if (prevSelectedTodo) {
            prevSelectedTodo.classList.remove("selected-tab");
          }
          button.classList.add("selected-tab");
        }
      }
    });

    // Handle double click events
    todoButtons.forEach(button => {
      button.addEventListener("dblclick", handleDblClick);

      /**
       * A function that handles what happens if the button gets double clicked
       */
      function handleDblClick(e) {
        if (e.target.computedRole != "checkbox") {
          // Extract the specific todo so that information can be extracted to populate the dialog box
          const todoArray = _extractCorrectTodoArray();
          // console.log(todoArray);
          const extractedTodo = _extractCorrectTodo(todoArray);
          // console.log(extractedTodo);

          // Handle DOM changes when the todo is double clicked
          _handleInfoEditDialogLoad(extractedTodo);
          _handleInfoEditPostSubmission(extractedTodo);
        }

        /**
         * Helper function to extract the correct project's todoArray
         */
        function _extractCorrectTodoArray() {
          // Select the relevant todo information for project and todo extraction
          const todoParentProject = button.dataset.parentProject;
          const allProjects = todoController.allProjects;
          
          // Extract the correct parentProject using a loop
          for (let i = 0; i < allProjects.length; i++) {
            // console.log(allProjects[i]);
            if (allProjects[i].projectName == todoParentProject) {
              // Return the extracted todoArray
              return allProjects[i].allTodos;
            }
          }
          
          console.log("No todoArray found");
        }

        /**
         * Helper function to extract the correct todo
         */
        function _extractCorrectTodo(todoArray) {
          const todoTitle = button.dataset.title;
          
          // Extract the specific todo using a loop
          for (let i = 0; i < todoArray.length; i++) {
            if (todoArray[i].title == todoTitle) {
              // Return the extracted todo
              return todoArray[i];
            }
          }
          console.log("No todo found");
        }

        /**
         * Helper function to handle the initial dialog loading
         */
        function _handleInfoEditDialogLoad(extractedTodo) {
          // Select the dialog
          const dialogBox = document.querySelector("dialog");

          // Open the dialog 
          dialogBox.showModal();

          // "Depopulate" the dialog
          dialogBox.textContent = "";

          //// Fill in the relevant html dialog information (forms and their respective classes for styling)
          // Create the Form for information entry
          const todoEditForm = document.createElement("form");
          todoEditForm.setAttribute("id", "todo-edit-form");

          // Create an input (text type) for editing title and set default value to todo's title
          const todoEditTitleLabel = document.createElement("label");
          todoEditTitleLabel.setAttribute("for", "todo-edit-title");
          todoEditTitleLabel.textContent = "Title";
          
          const todoEditTitle = document.createElement("input");
          todoEditTitle.setAttribute("type", "text");
          todoEditTitle.setAttribute("name", "todo-edit-title");
          todoEditTitle.setAttribute("id", "todo-edit-title");
          todoEditTitle.setAttribute("placeholder", "title");
          todoEditTitle.setAttribute("value", extractedTodo.title);

          // Create a textarea for todo description editing and set default value to todo's description
          const todoEditDescriptionLabel = document.createElement("label");
          todoEditDescriptionLabel.setAttribute("for", "todo-edit-description");
          todoEditDescriptionLabel.textContent = "Description";
          
          const todoEditDescription = document.createElement("textarea");
          todoEditDescription.setAttribute("name", "todo-edit-description");
          todoEditDescription.setAttribute("id", "todo-edit-description");
          todoEditDescription.setAttribute("placeholder", "description");
          todoEditDescription.textContent = extractedTodo.description;
          todoEditDescription.setAttribute("cols", "60");
          todoEditDescription.setAttribute("rows", "10");

          // Create an input (date type) for editing due date and set default value to todo's due date
          const todoEditDueDateLabel = document.createElement("label");
          todoEditDueDateLabel.setAttribute("for", "todo-edit-duedate");
          todoEditDueDateLabel.textContent = "Due Date";

          const todoEditDueDate = document.createElement("input");
          todoEditDueDate.setAttribute("type", "date");
          todoEditDueDate.setAttribute("name", "todo-edit-duedate");
          todoEditDueDate.setAttribute("id", "todo-edit-duedate");
          todoEditDueDate.setAttribute("value", format(extractedTodo.dueDate, "yyyy-MM-dd")); // e.g. 2024-01-18

          // Create a select for editing priority and set options to all three priority levels
          const todoEditPriorityLabel = document.createElement("label");
          todoEditPriorityLabel.setAttribute("for", "todo-edit-priority");
          todoEditPriorityLabel.textContent = "Priority";

          const todoEditPriority = document.createElement("select");
          todoEditPriority.setAttribute("name", "todo-edit-priority");
          todoEditPriority.setAttribute("id", "todo-edit-priority");

          const highPriority = document.createElement("option");
          highPriority.setAttribute("value", "high");
          highPriority.textContent = "High";

          const medPriority = document.createElement("option");
          medPriority.setAttribute("value", "medium");
          medPriority.textContent = "Medium";

          const lowPriority = document.createElement("option");
          lowPriority.setAttribute("value", "low");
          lowPriority.textContent = "Low";

          if (extractedTodo.priority == "high") { // Setting the default select option for priority
            highPriority.setAttribute("selected", "");
          } else if (extractedTodo.priority == "medium") {
            medPriority.setAttribute("selected", "");
          } else if (extractedTodo.priority == "low") {
            lowPriority.setAttribute("selected", "");
          }

          todoEditPriority.appendChild(highPriority);
          todoEditPriority.appendChild(medPriority);
          todoEditPriority.appendChild(lowPriority);
            
          // Create a select for editing the parentProject and set the options to all the existing projects
          const todoEditParentProjectLabel = document.createElement("label");
          todoEditParentProjectLabel.setAttribute("for", "todo-edit-parentproject");
          todoEditParentProjectLabel.textContent = "Parent Project";
          
          const todoEditParentProject = document.createElement("select");
          todoEditParentProject.setAttribute("name", "todo-edit-parentproject");
          todoEditParentProject.setAttribute("id", "todo-edit-parentproject");
          
          todoController.allProjects.forEach(project => { // Loop through each existing project and append to the options
            const projectName = document.createElement("option");
            projectName.setAttribute("value", project.projectName);
            projectName.textContent = project.projectName;
            if (extractedTodo.parentProject == project.projectName) { // Set the default selection option for parent project
              projectName.setAttribute("selected", "");
            }

            todoEditParentProject.appendChild(projectName);
          });

          // Create a div for holding the cancel and submit buttons
          const buttonContainer = document.createElement("div");
          buttonContainer.setAttribute("id", "todo-edit-submit-buttons");

          const cancelButton = document.createElement("button");
          cancelButton.setAttribute("type", "button")
          cancelButton.setAttribute("value", "cancel");
          cancelButton.textContent = "Cancel";

          const submitButton = document.createElement("button");
          submitButton.setAttribute("type", "button")
          submitButton.setAttribute("value", "submit");
          submitButton.textContent = "Submit";

          buttonContainer.appendChild(cancelButton);
          buttonContainer.appendChild(submitButton);

          // Append everything to the form
          todoEditForm.appendChild(todoEditTitleLabel);
          todoEditForm.appendChild(todoEditTitle);
          todoEditForm.appendChild(todoEditDescriptionLabel);
          todoEditForm.appendChild(todoEditDescription);
          todoEditForm.appendChild(todoEditDueDateLabel);
          todoEditForm.appendChild(todoEditDueDate);
          todoEditForm.appendChild(todoEditPriorityLabel);
          todoEditForm.appendChild(todoEditPriority);
          todoEditForm.appendChild(todoEditParentProjectLabel);
          todoEditForm.appendChild(todoEditParentProject);
          todoEditForm.appendChild(buttonContainer);
          dialogBox.appendChild(todoEditForm);
        }
    
        /**
         * Helper function to handle backend logic upon dialog form submission
         */
        function _handleInfoEditPostSubmission(extractedTodo) {
          // Handle what happens if the cancel or submit button is pressed
          const formButtons = document.querySelectorAll("#todo-edit-submit-buttons > button");
          const dialogBox = document.querySelector("dialog");
          
          formButtons.forEach(button => {
            button.addEventListener("click", (e) => {
              // Prevent submission from happening
              e.preventDefault();

              // Only execute if the button pressed is "submit"
              if (e.target.innerText == "Submit") {
                // Extract all the relevant description info
                const todoTitleInput = document.querySelector("#todo-edit-title");
                const todoDescriptionTextarea = document.querySelector("#todo-edit-description");
                const todoDueDateInput = document.querySelector("#todo-edit-duedate");
                const todoEditPrioritySelect = document.querySelector("#todo-edit-priority");
                const todoEditParentProjectSelect = document.querySelector("#todo-edit-parentproject");

                const todoTitleValue = todoTitleInput.value;
                const todoDescriptionValue = todoDescriptionTextarea.value;
                const todoDueDateValue = todoDueDateInput.value; // Remember to enter this value to new Date() when updating
                const todoEditPriorityValue = todoEditPrioritySelect.value;
                const todoEditParentProjectValue = todoEditParentProjectSelect.value;

                // Checking values
                // console.log(todoTitleValue);
                // console.log(todoDescriptionValue);
                // console.log(todoDueDateValue);
                // console.log(todoEditPriorityValue);
                // console.log(todoEditParentProjectValue);

                // Update todo information at the backend
                extractedTodo.title = todoTitleValue;
                extractedTodo.description = todoDescriptionValue;
                extractedTodo.dueDate = new Date(todoDueDateValue);
                extractedTodo.priority = todoEditPriorityValue;

                // Handle what happens if the parentProject changes
                if (extractedTodo.parentProject != todoEditParentProjectValue) {
                  const oldProject = todoController.extractProject(extractedTodo.parentProject);
                  const newProject = todoController.extractProject(todoEditParentProjectValue);
                  const oldProjectTodoArray = oldProject.allTodos;
                  const newProjectTodoArray = newProject.allTodos;

                  for (let i = 0; i < oldProjectTodoArray.length; i++) {
                    if (oldProjectTodoArray[i].title == extractedTodo.title) {
                      // Push the todo to the new project, then remove it from the old project
                      newProjectTodoArray.push(oldProjectTodoArray[i]);
                      oldProjectTodoArray.splice(i, 1);

                      // Update the parentProject for the todo
                      extractedTodo.parentProject = todoEditParentProjectValue;
                      break;
                    }
                  }


                }
                
                // Close the dialog and "depopulate" it
                dialogBox.close();
                dialogBox.textContent = "";

                // Reload mainbar todo display
                const currentDisplayTitleElement = document.querySelector("#main-panel-title-content");
                const currentDisplayTitle = currentDisplayTitleElement.dataset.title;
                mainbarDisplayHandler.reloadMainbarTodo(currentDisplayTitle);

                // Reload ALL mainbar events
                reloadCommonMainbarEvents();

                // Reload sidebar project tasks count
                sidebarController.todoCountLoader.reloadAllProjectTaskCount();
              
              } else {
                dialogBox.close();
                dialogBox.textContent = "";
              }
            })
          })
        }
      }
    });
  };

  /**
   * Handle logic for deleting a todo
   */
  const handleTodoDeletionEvent = () => {
    // Select all todo buttons on the page
    const todoButtons = document.querySelectorAll("#main-panel-content > button");

    // Add event listener: If press backspace → delete the todo → Update frontend and backend.
    todoButtons.forEach(button => {
      button.addEventListener("keyup", handleDeletion);

      function handleDeletion(e) {
        if (e.key == "Backspace") {
          console.log("Deleting this todo!");
          // Delete the todo in the backend and frontend
          _handleTodoDeletionBackend(button);
          _handleTodoDeletionDOM(button);

          // Reload all sidebar project count
          sidebarController.todoCountLoader.reloadEveryTaskCount();

        }
      }

      /**
       * Helper function to handle backend changes for todo deletion
       */
      function _handleTodoDeletionBackend(button) {
        // Get the todoArray from the parent project
        const parentProject = button.dataset.parentProject;
        const todoArray = todoController.extractTodos(parentProject);
        const todoTitle = button.dataset.title;
        
        // Loop through the array, if the title matches this button, splice it out of the array
        for (let i = 0; i < todoArray.length; i++) {
          if (todoArray[i].title == todoTitle) {
            todoArray.splice(i, 1);
            return;
          }
        }
      }

      /**
       * Helper function to handle DOM changes for todo deletion
       */
      function _handleTodoDeletionDOM(button) {
        button.remove();
      }
    });
  };

  /**
   * Handle logic for todo addition
   */
  const handleTodoAdditionEvent = () => {
    // Select the addition button and add a click event listener
    const addTodoButton = document.querySelector("#add-task > button");
    addTodoButton.addEventListener("click", handleTodoAddition);

    function handleTodoAddition(e) {
      _handleTodoAdditionDialogLoad();
      _handleTodoAdditionPostSubmission();
      
      /**
       * A function to populate the dialog (to copy todo-edit styling)
       */
      function _handleTodoAdditionDialogLoad() {
        // Select the dialog
        const dialogBox = document.querySelector("dialog");

        // Open the dialog 
        dialogBox.showModal();

        // "Depopulate" the dialog
        dialogBox.textContent = "";

        //// Fill in the relevant html dialog information (forms and their respective classes for styling)
        // Create the Form for information entry
        const todoEditForm = document.createElement("form");
        todoEditForm.setAttribute("id", "todo-edit-form");

        // Create an input (text type) for editing title and set default value to todo's title
        const todoEditTitleLabel = document.createElement("label");
        todoEditTitleLabel.setAttribute("for", "todo-edit-title");
        todoEditTitleLabel.textContent = "Title";
        
        const todoEditTitle = document.createElement("input");
        todoEditTitle.setAttribute("type", "text");
        todoEditTitle.setAttribute("name", "todo-edit-title");
        todoEditTitle.setAttribute("id", "todo-edit-title");
        todoEditTitle.setAttribute("placeholder", "title");

        // Create a textarea for todo description editing and set default value to todo's description
        const todoEditDescriptionLabel = document.createElement("label");
        todoEditDescriptionLabel.setAttribute("for", "todo-edit-description");
        todoEditDescriptionLabel.textContent = "Description";
        
        const todoEditDescription = document.createElement("textarea");
        todoEditDescription.setAttribute("name", "todo-edit-description");
        todoEditDescription.setAttribute("id", "todo-edit-description");
        todoEditDescription.setAttribute("placeholder", "description");
        todoEditDescription.setAttribute("cols", "60");
        todoEditDescription.setAttribute("rows", "10");

        // Create an input (date type) for editing due date and set default value to todo's due date
        const todoEditDueDateLabel = document.createElement("label");
        todoEditDueDateLabel.setAttribute("for", "todo-edit-duedate");
        todoEditDueDateLabel.textContent = "Due Date";

        const todoEditDueDate = document.createElement("input");
        todoEditDueDate.setAttribute("type", "date");
        todoEditDueDate.setAttribute("name", "todo-edit-duedate");
        todoEditDueDate.setAttribute("id", "todo-edit-duedate");

        // Create a select for editing priority and set options to all three priority levels
        const todoEditPriorityLabel = document.createElement("label");
        todoEditPriorityLabel.setAttribute("for", "todo-edit-priority");
        todoEditPriorityLabel.textContent = "Priority";

        const todoEditPriority = document.createElement("select");
        todoEditPriority.setAttribute("name", "todo-edit-priority");
        todoEditPriority.setAttribute("id", "todo-edit-priority");

        const highPriority = document.createElement("option");
        highPriority.setAttribute("value", "high");
        highPriority.textContent = "High";

        const medPriority = document.createElement("option");
        medPriority.setAttribute("value", "medium");
        medPriority.textContent = "Medium";

        const lowPriority = document.createElement("option");
        lowPriority.setAttribute("value", "low");
        lowPriority.textContent = "Low";

        todoEditPriority.appendChild(highPriority);
        todoEditPriority.appendChild(medPriority);
        todoEditPriority.appendChild(lowPriority);
          
        // Create a select for editing the parentProject and set the options to all the existing projects
        const todoEditParentProjectLabel = document.createElement("label");
        todoEditParentProjectLabel.setAttribute("for", "todo-edit-parentproject");
        todoEditParentProjectLabel.textContent = "Parent Project";
        
        const todoEditParentProject = document.createElement("select");
        todoEditParentProject.setAttribute("name", "todo-edit-parentproject");
        todoEditParentProject.setAttribute("id", "todo-edit-parentproject");
        
        todoController.allProjects.forEach(project => { // Loop through each existing project and append to the options
          const projectName = document.createElement("option");
          projectName.setAttribute("value", project.projectName);
          projectName.textContent = project.projectName;
          todoEditParentProject.appendChild(projectName);
        });

        // Create a div for holding the cancel and submit buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.setAttribute("id", "todo-edit-submit-buttons");

        const cancelButton = document.createElement("button");
        cancelButton.setAttribute("type", "button")
        cancelButton.setAttribute("value", "cancel");
        cancelButton.textContent = "Cancel";

        const submitButton = document.createElement("button");
        submitButton.setAttribute("type", "button")
        submitButton.setAttribute("value", "submit");
        submitButton.textContent = "Submit";

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);

        // Append everything to the form
        todoEditForm.appendChild(todoEditTitleLabel);
        todoEditForm.appendChild(todoEditTitle);
        todoEditForm.appendChild(todoEditDescriptionLabel);
        todoEditForm.appendChild(todoEditDescription);
        todoEditForm.appendChild(todoEditDueDateLabel);
        todoEditForm.appendChild(todoEditDueDate);
        todoEditForm.appendChild(todoEditPriorityLabel);
        todoEditForm.appendChild(todoEditPriority);
        todoEditForm.appendChild(todoEditParentProjectLabel);
        todoEditForm.appendChild(todoEditParentProject);
        todoEditForm.appendChild(buttonContainer);
        dialogBox.appendChild(todoEditForm);
      }

      /**
       * A function to handle post-submission
       */
      function _handleTodoAdditionPostSubmission() {
        // Handle what happens if the cancel or submit button is pressed
        const formButtons = document.querySelectorAll("#todo-edit-submit-buttons > button");
        const dialogBox = document.querySelector("dialog");
        
        formButtons.forEach(button => {
          button.addEventListener("click", (e) => {
            // Prevent submission from happening
            e.preventDefault();

            // Only execute if the button pressed is "submit"
            if (e.target.innerText == "Submit") {
              // Find the correct project
              const todoEditParentProjectSelect = document.querySelector("#todo-edit-parentproject");
              const todoEditParentProjectValue = todoEditParentProjectSelect.value;

              const parentProjectName = todoEditParentProjectValue;
              const allProjects = todoController.allProjects;

              for (let i = 0; i < allProjects.length; i++) {
                if (allProjects[i].projectName == parentProjectName) {
                  // Assign parentProject to a variable
                  const parentProject = allProjects[i];

                  // Get all the necessary inputs to create a todo
                  const todoTitleInput = document.querySelector("#todo-edit-title");
                  const todoDescriptionTextarea = document.querySelector("#todo-edit-description");
                  const todoDueDateInput = document.querySelector("#todo-edit-duedate");
                  const todoEditPrioritySelect = document.querySelector("#todo-edit-priority");
                    
                  const todoTitleValue = todoTitleInput.value;
                  const todoDescriptionValue = todoDescriptionTextarea.value;
                  const todoDueDateValue = todoDueDateInput.value; // Remember to enter this value to new Date() when updating
                  const todoEditPriorityValue = todoEditPrioritySelect.value;
                                    
                  // Create a new todo with the filled input (title, description, dueDate, priority, parentProject)
                  parentProject.createTodo(todoTitleValue, todoDescriptionValue, todoDueDateValue, todoEditPriorityValue, todoEditParentProjectValue);
                }
              }
              
              // Close the dialog and "depopulate" it
              dialogBox.close();
              dialogBox.textContent = "";

              // Reload mainbar todo display
              const currentDisplayTitleElement = document.querySelector("#main-panel-title-content");
              const currentDisplayTitle = currentDisplayTitleElement.dataset.title;
              mainbarDisplayHandler.reloadMainbarTodo(currentDisplayTitle);

              // Reload ALL mainbar events
              reloadCommonMainbarEvents();

              // Reload sidebar project tasks count
              sidebarController.todoCountLoader.reloadEveryTaskCount();
            
            } else {
              dialogBox.close();
              dialogBox.textContent = "";
            }
          })
        })
        

      }

    }
  }

  /*
    Function that consolidates all the mainbar events that requires reloading frequently
  */
  function reloadCommonMainbarEvents() {
    handleTodoCheckboxEvent();
    handleDynamicTodoCount();
    handleProjectTitleEdit();
    handleProjectDeletion();
    handleTodoInfoEdit();
    handleTodoDeletionEvent();
    handleTodoAdditionEvent();
  }

  return {
    reloadCommonMainbarEvents,
    handleTodoCheckboxEvent,
    handleDynamicTodoCount,
    handleProjectTitleEdit,
    handleProjectDeletion,
    handleTodoInfoEdit,
    handleTodoDeletionEvent,
    handleTodoAdditionEvent
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
