import todoController from "./todoController.js";
import testUnitModule from "./testUnitModule.js";
import sidebarController from "./sidebarController.js";
import mainbarController from "./mainbarController.js";

/* 
  Module Pattern that handles anything regarding page initialization
*/
const pageInitializationHandler = (() => {
  const initializePage = () => {
    // Load initial sidebar events
    sidebarController.tabStyler.styleTabs();
    sidebarController.todoCountLoader.loadAllTasksCount();
    sidebarController.todoCountLoader.loadTodayTasksCount();
    sidebarController.todoCountLoader.loadWeekTasksCount();
    sidebarController.projectController.loadNewProjectUI();

    // Load initial mainbar events
    mainbarController.mainbarDisplayHandler.loadMainbar();
    mainbarController.mainbarEventHandler.handleTodoCheckboxEvent();

    // Handle todo count dynamics after mainbar loading (e.g. todo count update after checking a checkbox)
    sidebarController.todoCountLoader.handleDynamicTodoCount();
  };

  return { initializePage };
})();

/*
  Module Pattern that handles dynamic changes on the page (e.g. todo count changes and strikethrough when a checkbox is checked)
*/
const dynamicDOMHandler = (() => {
  // Handle DOM changes when a new sidebar tab is selected. Whenever a new sidetab is selected → mainbar UI from mainbarController will reload → dynamic todo count from sidebarController will also need to be reloaded.
  const handleDOMReloading = () => {
    // Get all the sidebar tabs
    const sidebarTabs = document.querySelectorAll(
      "#home > button, #projects > button"
    );

    // Every time a new tab is clicked, reload todo-checkbox-event-handler for the mainbar and re-initiate todo count dynamics for sidebar
    sidebarTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Reload todo checkbox event handler
        mainbarController.mainbarEventHandler.handleTodoCheckboxEvent();
        sidebarController.todoCountLoader.handleDynamicTodoCount();
      });
    });
  };

  return {
    handleDOMReloading,
  };
})();

/* 
  Module Pattern that handles anything with testing
*/
const testUnitHandler = (() => {
  const addTodoTestUnit = () => {
    // Create Project and Todo
    testUnitModule.projectCreationTestUnit.createProjectX();
    testUnitModule.projectCreationTestUnit.createProjectXTodo();

    // Load task count for each sidebar tab
    sidebarController.todoCountLoader.loadAllTasksCount();
    console.log("If this is printed, allTasksCount is loaded");
    sidebarController.todoCountLoader.loadTodayTasksCount();
    console.log("If this is printed, todayTasksCount is loaded");
    sidebarController.todoCountLoader.loadWeekTasksCount();
    console.log("If this is printed, weekTasksCount is loaded");
    sidebarController.todoCountLoader.loadProjectTasksCount('Project-X');
    console.log("If this is printed, Project-X tasks count is loaded");
  };

  return { addTodoTestUnit };
})();

const DOMControllerModule = (() => {
  return {
    pageInitializationHandler,
    testUnitHandler,
    dynamicDOMHandler,
  };
})();

export default DOMControllerModule;
