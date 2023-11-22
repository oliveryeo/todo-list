import todoController from './todoController.js';

// screenController Module
const screenController = (() => {
  initializePage();

  return {

  }
})();

function initializePage() {
  const allTasks = document.querySelector('#all-tasks');
  const today = document.querySelector('#today');
  const week = document.querySelector('#week');
  const newProject = document.querySelector('#new-project');

  const initializingItems = new Array(allTasks, today, week, newProject);
  initializingItems.forEach(item => {
    // Add .selected-tab class to current selected tab
    item.addEventListener('click', () => {
      // Remove .selected-tab class from previous selected tab
      const prevSelectedTab = document.querySelector('.selected-tab');
      if (prevSelectedTab) {
        prevSelectedTab.classList.remove('selected-tab');
      }
      item.classList.add('selected-tab');
    });
  });
}


export default screenController;