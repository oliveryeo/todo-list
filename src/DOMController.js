import testUnitModule from "./testUnitModule.js";
import sidebarController from "./sidebarController.js";
import mainbarController from "./mainbarController.js";

/**
 * Module Pattern that handles anything regarding page initialization
 */
const pageInitializationHandler = (() => {
  /**
   * Load the initial page load events
   */
  const initializePage = () => {
    // Load initial sidebar events (tab styling, home tab tasks count, new project events)
    sidebarController.tabStyler.styleTabs();
    sidebarController.todoCountLoader.loadAllTaskCount();
    sidebarController.todoCountLoader.loadTodayTaskCount();
    sidebarController.todoCountLoader.loadWeekTaskCount();
    sidebarController.projectController.loadNewProjectUI();
    sidebarController.projectController.projectDisplayReloader();

    // Load initial mainbar events
    mainbarController.mainbarDisplayHandler.loadDefaultMainbarDisplay();
    mainbarController.mainbarDisplayHandler.loadMainbarDisplayEvents();

    // Do an initial loading of the event dynamics on page load
    mainbarController.mainbarEventHandler.reloadCommonMainbarEvents();

    // Load todo events dynamics
    _loadTodoEventDynamics();

    function _loadTodoEventDynamics() {
      // Do the loading of event dynamics whenever a new side tab is selected
      const sidebarTabs = document.querySelectorAll("#home > button, #projects > button");

      // Every time a new tab is clicked, reload todo-checkbox-event-handler for the mainbar and re-initiate todo count dynamics for sidebar
      sidebarTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          // Reload todo checkbox event handler
          mainbarController.mainbarEventHandler.reloadCommonMainbarEvents();
        });
      });
    }
  };

  return { initializePage };
})();

/**
 * Module Pattern that handles anything with testing
 */
const testUnitHandler = (() => {
  const addTodoTestUnit = () => {
    // Create Project and Todo
    testUnitModule.projectCreationTestUnit.createProjectX();
    testUnitModule.projectCreationTestUnit.createProjectXTodo();
    testUnitModule.projectCreationTestUnit.createProjectY();
    testUnitModule.projectCreationTestUnit.createProjectYTodo();

    // Load task count for each sidebar tab
    sidebarController.todoCountLoader.loadAllTaskCount();
    console.log("If this is printed, allTasksCount is loaded");
    sidebarController.todoCountLoader.loadTodayTaskCount();
    console.log("If this is printed, todayTasksCount is loaded");
    sidebarController.todoCountLoader.loadWeekTaskCount();
    console.log("If this is printed, weekTasksCount is loaded");
    sidebarController.todoCountLoader.loadProjectTaskCount('Project-X');
    console.log("If this is printed, Project-X tasks count is loaded");
    sidebarController.todoCountLoader.loadProjectTaskCount('Project-Y');
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
