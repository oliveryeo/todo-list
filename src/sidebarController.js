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
  Count loader Module Pattern 
*/
const countLoader = (() => {
  // Function to load todo count for all tasks tab
  const loadAllTasksCount = () => {
    // Extract count of todos from all projects
    let allTasksCount = 0;
    todoController.allProjects.forEach(project => {
      allTasksCount += project.allTodos.length;
    });
    
    // If count element already exist, change the count
    const allTasks = document.querySelector('#all-tasks');
    const existingCountElement = document.querySelector('#all-tasks > .count');
    if (existingCountElement) {
      existingCountElement.textContent = allTasksCount;
    } else { // else, create and append count element to the tab
      const countElement = document.createElement('div');
      countElement.classList.add('count');
      countElement.textContent = allTasksCount;
      allTasks.appendChild(countElement);
    }
  };
  
  // TODO: Function to load todo count for today tasks tab (To do once due date function is implemented)
  const loadTodayTasksCount = () => {

  };

  // TODO: Function to load todo count for week tasks tab (To do once due date function is implemented)
  const loadWeekTasksCount = () => {

  };

  // TODO: Function to load task count for a specific project. Can be re-used to update task count.
  const loadProjectTasksCount = (projectName) => {
    // Loop through all projects -> Use projectName to sieve out the specific project
    todoController.allProjects.forEach(project => {
      if (project.projectName == projectName) {
        let projectTasksCount = project.allTodos.length;

        // If count element already exist, change the count
        console.log('#' + projectName);
        const selectedProject = document.querySelector('#' + projectName);
        const existingCountElement = document.querySelector('#' + projectName + ' > .count');
        if (existingCountElement) {
          existingCountElement.textContent = projectTasksCount;
        } else { // else, create and append count element to the tab
          const countElement = document.createElement('div');
          countElement.classList.add('count');
          countElement.textContent = projectTasksCount;
          selectedProject.appendChild(countElement);
        }
      }
    });

    // Get the length of the todos array and create a count element similar to loadAllTasksCount()
  };

  return {
    loadAllTasksCount,
    loadTodayTasksCount,
    loadWeekTasksCount,
    loadProjectTasksCount
  }
})();

/* 
  Project controller Module Pattern 
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
          _projectDisplayLoader();
        }
      });

      newProjectButton.appendChild(inputField);
    };
  };

  // Helper function that helps to load all the current projects onto the DOM
  function _projectDisplayLoader() {
    // Remove all currently displayed projects
    const currentDisplayedProjects = document.querySelectorAll('#projects > button');
    currentDisplayedProjects.forEach((displayedProject) => displayedProject.remove());

    // Loop through the updated projects
    const updatedProjects = todoController.allProjects;
    updatedProjects.forEach((project) => {
      const projectName = project.projectName;
      const todoCount = project.allTodos.length;

      // Create a button with a div child (for project name), and a div child for todos count (with the class of "count")
      // Ensure that the button has an id of the project's name as well
      // Append child to #projects
      const projectButton = document.createElement('button');
      projectButton.setAttribute('id', projectName);

      const projectNameDisplay = document.createElement('div');
      projectNameDisplay.textContent = projectName;

      const projectTodoCount = document.createElement('div');
      projectTodoCount.classList.add('count');
      projectTodoCount.textContent = todoCount;

      projectButton.appendChild(projectNameDisplay);
      projectButton.appendChild(projectTodoCount);

      const projectContainer = document.querySelector('#projects');
      projectContainer.appendChild(projectButton);
    });
  };

  return {
    loadNewProjectUI
  }
})();

/* 
  sidebarController Module.
  Required to be declared last in order to use module patterns declared above.
*/
const sidebarController = (() => {
  const initializePage = () => {
    tabStyler.styleTabs();
    countLoader.loadAllTasksCount();
    projectController.loadNewProjectUI();
  }

  const addTodoTestUnit = () => {
    todoControllerTestUnit();

    countLoader.loadAllTasksCount();
    console.log("If this is printed, allTasksCount is loaded");

    countLoader.loadProjectTasksCount('Project-X');
    console.log("If this is printed, Project-X tasks count is loaded");
  }

  return {
    initializePage,
    addTodoTestUnit
  }
})();

export default sidebarController;