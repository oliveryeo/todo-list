import todoController from './todoController.js';
import todoControllerTestUnit from './todoControllerTestUnit.js';
/* 
  Tab styler module pattern 
*/
const tabStyler = (() => {
  const styleTabs = () => {
    // Select all the tabs in side bar that requires .selected-tab styling when clicked
    const allTabs = document.querySelectorAll('#home > button, #projects > button');
    allTabs.forEach(item => {
      // Add or remove .selected-tab class on click for each tab
      item.addEventListener('click', () => {
        // Remove .selected-tab class from previous selected tab
        const prevSelectedTab = document.querySelector('.selected-tab');
        if (prevSelectedTab) {
          prevSelectedTab.classList.remove('selected-tab');
        }
        // Add .selected-tab class to current selected tab
        item.classList.add('selected-tab');
      });
    });
  };

  return {
    styleTabs
  };
})();

/* 
  Todo Count loader Module Pattern 
*/
const todoCountLoader = (() => {
  // Function to load todo count for all tasks tab
  const loadAllTasksCount = () => {
    // Extract count of todos from all projects
    let allTasksCount = todoController.extractAllTodos().length;
    
    // If count element already exist, change the count
    modifyCountDisplay('All tasks', allTasksCount);
  };
  
  // Function to load todo count for today tasks tab (To do once due date function is implemented)
  const loadTodayTasksCount = () => {
    // Extract count of todos due today
    let todayTasksCount = todoController.extractTodayTodos().length;
    modifyCountDisplay('Today', todayTasksCount);
    
  };

  // Function to load todo count for week tasks tab (To do once due date function is implemented)
  const loadWeekTasksCount = () => {
    let weekTasksCount = todoController.extractWeekTodos().length;
    modifyCountDisplay('Week', weekTasksCount);

  };

  // Function to load task count for a specific project. Can be re-used to update task count.
  const loadProjectTasksCount = (projectName) => {
    // Extract todo array for a specific project → If array exists, then extract count and modify count display
    let projectTodoArray = todoController.extractProjectTodos(projectName);
    // console.log("Below is the extracted array in sidebar controller");
    // console.log(projectTodoArray);
    if (projectTodoArray) {
      let projectTasksCount = projectTodoArray.length;
      modifyCountDisplay(projectName, projectTasksCount);
    }
  };

  function modifyCountDisplay(dataTitle, tasksCountNumber) {
    const elementDataTitle = '[' + 'data-title=' + '"' + dataTitle + '"' + ']';
    const selectedElement = document.querySelector(elementDataTitle);
    const existingCountElement = document.querySelector(elementDataTitle + ' > .count');
    // If count element already exist, change the count
    if (existingCountElement) {
      existingCountElement.textContent = tasksCountNumber;
    } else { // else, create and append count element to the tab
      const countElement = document.createElement('div');
      countElement.classList.add('count');
      countElement.textContent = tasksCountNumber;
      selectedElement.appendChild(countElement);
    }
  }

  return {
    loadAllTasksCount,
    loadTodayTasksCount,
    loadWeekTasksCount,
    loadProjectTasksCount
  }
})();

/* 
  Project controller Module Pattern responsible for adding new projects
*/
const projectController = (() => {
  /* Function to handle UI for new projects */
  const loadNewProjectUI = () => {
    // Upon submission of the text input, create a new project via todoController, and update the DOM of the new project
    // Upon clicking the newproject, create a new input box and add class .new-project.input, which will overlap the new project button
    const newProjectButton = document.querySelector('#new-project');
    newProjectButton.addEventListener('click', createInputField);

    function createInputField() {
      // Remove click event listener to prevent double input field pop up
      newProjectButton.removeEventListener('click', createInputField);

      // Create new input box and add class .new-project.input
      const inputField = document.createElement('input');
      inputField.classList.add('new-project-input');
      inputField.setAttribute("type", "text");
      inputField.setAttribute("placeholder", "Project Name ('enter' to add)");
      
      // Add event listener to inputField -> when enter key is lifted, use that value to create a new project and remove the whole input box from the DOM
      inputField.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          // Create new project
          const newProjectName = inputField.value; // Project name
          todoController.createProject(newProjectName);

          // Remove the input field from the DOM
          inputField.remove();

          // Add back the click event listener to newProjectButton by recursion
          newProjectButton.addEventListener('click', createInputField);

          // Update displayed projects
          _updateProjectDisplay();
        }
      });

      newProjectButton.appendChild(inputField);
    };
  };

  // Helper function that helps to load all the current projects onto the DOM
  function _updateProjectDisplay() {
    // Remove all currently displayed projects
    const currentDisplayedProjects = document.querySelectorAll('#projects > button');
    currentDisplayedProjects.forEach((displayedProject) => displayedProject.remove());

    // Loop through the updated projects
    const updatedProjects = todoController.allProjects;
    updatedProjects.forEach((project) => {
      const projectName = project.projectName;
      const todoCount = project.allTodos.length;

      // Create a button with a div child (for project name), and a div child for todos count (with the class of "count"). Ensure that the button has an id of the project's name as well.
      const projectNameDisplay = document.createElement('div');
      projectNameDisplay.textContent = projectName;

      const projectTodoCount = document.createElement('div');
      projectTodoCount.classList.add('count');
      projectTodoCount.textContent = todoCount;

      const projectButton = document.createElement('button');
      projectButton.dataset.title = projectName;
      projectButton.appendChild(projectNameDisplay);
      projectButton.appendChild(projectTodoCount);

      // Append child to #projects
      const projectContainer = document.querySelector('#projects');
      projectContainer.appendChild(projectButton);
    });
  };

  return {
    loadNewProjectUI
  }
})();

/* 
  Module pattern that takes in the sidebar tab title and todo array
  and load into main bar view.
*/
const mainbarController = (() => {
  const loadMainbar = () => {
    // TODO: Extract the sidebar title and todoArray upon clicking
    const allTabButtons = document.querySelectorAll("#home > button, #projects > button");
  };

  function _loadMainbarUI(tabTitle, todoArray) {
    // Select .main-panel-title-content class -> change text content to tabTitle AND set the data-title attribute to tabTitle as well
    const mainPanelTitle = document.querySelector("#main-panel-title-content");
    mainPanelTitle.textContent = tabTitle;
    // Select #main-panel-content id:
    const mainPanelContent = document.querySelector("#main-panel-content");
      // Clear out ALL the todos on the page
      mainPanelContent.textContent = "";
      // Using the todoArray, create:
        
      todoArray.forEach(todo => {
        // A button with data-todo attribute of the todo title
        const todoButton = document.createElement('button');
        todoButton.dataset.title = todo.title;

        // An input of checkbox type
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'input');

        // A div containing the todo title as the content
        const todoTitle = document.createElement('div');
        todoTitle.textContent = todo.title;
        // A div with a class .todo-due-date, inside which contains:
          // An img with the triangle flag
          // A div containing the todo due date as the content
        const todoDueDateContainer = document.createElement('div');
        todoDueDateContainer.classList.add(".todo-due-date");
        const dueFlagImg = document.createElement('img');
        dueFlagImg.setAttribute("src", "./icons/flag-triangle.svg");
        const todoDueDate = document.createElement('div');
        todoDueDate.textContent = todo.dueDate;
        todoDueDateContainer.appendChild(dueFlagImg);
        todoDueDateContainer.appendChild(todoDueDate);

        // Joining everything together
        todoButton.appendChild(checkbox);
        todoButton.appendChild(todoTitle);
        todoButton.appendChild(todoDueDateContainer);
      })
        
        
  };
})();



const DOMControllerModule = (() => {
  const initializePage = () => {
    tabStyler.styleTabs();
    todoCountLoader.loadAllTasksCount();
    todoCountLoader.loadTodayTasksCount();
    todoCountLoader.loadWeekTasksCount();
    projectController.loadNewProjectUI();
  };

  const addTodoTestUnit = () => {
    todoControllerTestUnit();

    todoCountLoader.loadAllTasksCount();
    console.log("If this is printed, allTasksCount is loaded");
    todoCountLoader.loadTodayTasksCount();
    console.log("If this is printed, todayTasksCount is loaded");
    todoCountLoader.loadWeekTasksCount();
    console.log("If this is printed, weekTasksCount is loaded");

    todoCountLoader.loadProjectTasksCount('Project-X');
    console.log("If this is printed, Project-X tasks count is loaded");
  };

  return {
    initializePage,
    addTodoTestUnit
  }
})();

export default DOMControllerModule;