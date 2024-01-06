import testUnitModule from "./testUnitModule.js";
import sidebarController from "./sidebarController.js";
import mainbarController from "./mainbarController.js";

/* 
  Module Pattern that handles anything regarding page initialization
*/
const pageInitializationHandler = (() => {
  const initializePage = () => {
    // Load initial sidebar events (tab styling, home tab tasks count, new project events)
    sidebarController.tabStyler.styleTabs();
    sidebarController.todoCountLoader.loadAllTasksCount();
    sidebarController.todoCountLoader.loadTodayTasksCount();
    sidebarController.todoCountLoader.loadWeekTasksCount();
    sidebarController.projectController.loadNewProjectUI();

    // Load initial mainbar events
    mainbarController.mainbarDisplayHandler.loadDefaultMainbar();
    mainbarController.mainbarDisplayHandler.loadMainbar();

    // Load todo events dynamics
    _loadTodoEventDynamics();

    function _loadTodoEventDynamics() {
      // Do an initial loading of the event dynamics on page load
      mainbarController.mainbarEventHandler.handleTodoCheckboxEvent();
      sidebarController.todoCountLoader.handleDynamicTodoCount();
      mainbarController.mainbarEventHandler.handleProjectTitleEdit();

      // Do the loading of event dynamics whenever a new side tab is selected
      const sidebarTabs = document.querySelectorAll("#home > button, #projects > button");

      // Every time a new tab is clicked, reload todo-checkbox-event-handler for the mainbar and re-initiate todo count dynamics for sidebar
      sidebarTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          // Reload todo checkbox event handler
          mainbarController.mainbarEventHandler.handleTodoCheckboxEvent();
          sidebarController.todoCountLoader.handleDynamicTodoCount();
          mainbarController.mainbarEventHandler.handleProjectTitleEdit();
        });
      });
    }
  };

  return { initializePage };
})();

/* 
  Module Pattern that handles anything with testing
*/
const testUnitHandler = (() => {
  const addTodoTestUnit = () => {
    // Create Project and Todo
    testUnitModule.projectCreationTestUnit.createProjectX();
    testUnitModule.projectCreationTestUnit.createProjectXTodo();
    testUnitModule.projectCreationTestUnit.createProjectY();
    testUnitModule.projectCreationTestUnit.createProjectYTodo();

    // Load task count for each sidebar tab
    sidebarController.todoCountLoader.loadAllTasksCount();
    console.log("If this is printed, allTasksCount is loaded");
    sidebarController.todoCountLoader.loadTodayTasksCount();
    console.log("If this is printed, todayTasksCount is loaded");
    sidebarController.todoCountLoader.loadWeekTasksCount();
    console.log("If this is printed, weekTasksCount is loaded");
    sidebarController.todoCountLoader.loadProjectTasksCount('Project-X');
    console.log("If this is printed, Project-X tasks count is loaded");
    sidebarController.todoCountLoader.loadProjectTasksCount('Project-Y');
    console.log("If this is printed, Project-Y tasks count is loaded");
  };

  return { addTodoTestUnit };
})();

const DOMControllerModule = (() => {
  return {
    pageInitializationHandler,
    testUnitHandler
  };
})();

export default DOMControllerModule;
