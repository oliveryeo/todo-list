import todoController from "./todoController.js";
import testUnitModule from "./testUnitModule.js";
import sidebarController from "./sidebarController.js";
import mainbarController from "./mainbarController.js";

/* 
  Module Pattern that handles anything regarding page initialization
*/
const pageInitializationHandler = (() => {
  const initializePage = () => {
    sidebarController.loadInitialSidebarEvents();
    mainbarController.loadInitialMainbar();
    sidebarController.handlePostMainbarLoading();
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

    // Every time a new tab is clicked, reloadTodoCheckboxEventHandler() for the mainbar and handlePostMainbarLoading() for sidebar
    sidebarTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        mainbarController.reloadTodoCheckboxEventHandler();
        sidebarController.handlePostMainbarLoading();
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
    testUnitModule.runProjectCreationTestUnit();
    sidebarController.todoCountLoaderTestUnit();
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
