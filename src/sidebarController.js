import todoController from './todoController.js';
import todoControllerTestUnit from './todoControllerTestUnit.js';

// Tab styler module pattern
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

// Count loader Module Pattern 
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
  
  // Function to load todo count for today tasks tab (To do once due date function is implemented)
  const loadTodayTasksCount = () => {

  };

  // Function to load todo count for week tasks tab (To do once due date function is implemented)
  const loadWeekTasksCount = () => {

  };

  return {
    loadAllTasksCount,
    loadTodayTasksCount,
    loadWeekTasksCount
  }
})();

// New projects loader Module Pattern 
const newProjectsLoader = (() => {
  // Function to initialize UI for new projects
  const loadNewProject = () => {
    
  };
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