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
    } else { // else, create and append count element to all tasks tab
      const allTasksCountElement = document.createElement('div');
      allTasksCountElement.classList.add('count');
      allTasksCountElement.textContent = allTasksCount;
      allTasks.appendChild(allTasksCountElement);
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
        let projectTasksCount = 0;
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
  TODO: New project controller Module Pattern 
*/
const newProjectController = (() => {
  /* Function to text input UI for new projects when button is clicked */
  // Upon submission of the text input, create a new project via todoController
  const loadNewProjectUI = () => {
    // Text input value will be passed into todoController.createProject({ text input })

    // Based on project's name, create a new button project under #projects with its name and todo count
    
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
  }

  const addTodoTestUnit = () => {
    todoControllerTestUnit();
    countLoader.loadAllTasksCount();
  }

  return {
    initializePage,
    addTodoTestUnit
  }
})();

export default sidebarController;