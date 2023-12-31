import todoController from './todoController.js';
import todoControllerTestUnit from './todoControllerTestUnit.js';
import sidebarController from './sidebarController.js';
import mainbarController from './mainbarController.js';

const DOMControllerModule = (() => {
  const initializePage = () => {
    sidebarController.loadInitialSidebarEvents();
    mainbarController.reloadMainbar();
  };

  const addTodoTestUnit = () => {
    todoControllerTestUnit();
    sidebarController.todoCountLoaderTestUnit();
  };

  return {
    initializePage,
    addTodoTestUnit
  }
})();

export default DOMControllerModule;