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

/*
  Can consider making a Count loader Module Pattern 
*/
// Function to load todo count for all tasks tab
function loadAllTasksCount() {

}

// Function to load todo count for today tasks tab (To do once due date function is implemented)
function loadTodayTasksCount() {

}

// Function to load todo count for week tasks tab (To do once due date function is implemented)
function loadWeekTasksCount() {
  
}

/*
  Can consider making a new projects loader Module Pattern 
*/
// Function to initialize UI for new projects
function loadNewProject() {

}

export default screenController;