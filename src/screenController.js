import todoController from './todoController.js';

// screenController Module
const screenController = (() => {
  initializePage();

  return {

  }
})();

// Function to load appropriate eventlisteners for each tab
function initializePage() {
  const allTasks = document.querySelector('#all-tasks');
  const today = document.querySelector('#today');
  const week = document.querySelector('#week');

  const initializingItems = new Array(allTasks, today, week);
  initializingItems.forEach(item => {
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
}

// Count loader Module Pattern 
const countLoader = (() => {
  // Function to load todo count for all tasks tab
  const loadAllTasksCount = () => {

  };
  
  // Function to load todo count for today tasks tab (To do once due date function is implemented)
  const loadTodayTasksCount = () => {

  };

  // Function to load todo count for week tasks tab (To do once due date function is implemented)
  const loadWeekTasksCount = () => {

  };

  return {

  }
})();

// New projects loader Module Pattern 
const newProjectsLoader = (() => {
  // Function to initialize UI for new projects
  function loadNewProject() {

  }
})();

export default screenController;