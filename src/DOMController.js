import todoController from './todoController.js';
import todoControllerTestUnit from './todoControllerTestUnit.js';
import sidebarController from './sidebarController.js';
import mainbarController from './mainbarController.js';

const DOMControllerModule = (() => {
  const initializePage = () => {
    sidebarController.tabStyler.styleTabs();
    sidebarController.todoCountLoader.loadAllTasksCount();
    sidebarController.todoCountLoader.loadTodayTasksCount();
    sidebarController.todoCountLoader.loadWeekTasksCount();
    sidebarController.projectController.loadNewProjectUI();
    mainbarController.loadMainbar();
  };

  const addTodoTestUnit = () => {
    todoControllerTestUnit();

    sidebarController.todoCountLoader.loadAllTasksCount();
    console.log("If this is printed, allTasksCount is loaded");
    sidebarController.todoCountLoader.loadTodayTasksCount();
    console.log("If this is printed, todayTasksCount is loaded");
    sidebarController.todoCountLoader.loadWeekTasksCount();
    console.log("If this is printed, weekTasksCount is loaded");

    sidebarController.todoCountLoader.loadProjectTasksCount('Project-X');
    console.log("If this is printed, Project-X tasks count is loaded");
  };

  return {
    initializePage,
    addTodoTestUnit
  }
})();

export default DOMControllerModule;