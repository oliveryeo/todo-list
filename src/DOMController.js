import todoController from './todoController.js';
import testUnitModule from './testUnitModule.js';
import sidebarController from './sidebarController.js';
import mainbarController from './mainbarController.js';

/* 
  Module Pattern that handles anything regarding page initialization
*/
const pageInitializationHandler = (() => {
  const initializePage = () => {
    sidebarController.loadInitialSidebarEvents();
    mainbarController.reloadMainbar();
    sidebarController.handlePostMainbarLoading();
  };

  return { initializePage }
})();

/*
  Module Pattern that handles dynamic changes on the page
*/
const pageDynamicHandler = (() => {

})();

/* 
  Module Pattern that handles anything with testing
*/
const testUnitHandler = (() => {
  const addTodoTestUnit = () => {
    testUnitModule.runProjectCreationTestUnit();
    sidebarController.todoCountLoaderTestUnit();
  };

  return { addTodoTestUnit }
})();


const DOMControllerModule = (() => {

  return {
    pageInitializationHandler,
    testUnitHandler
  }
})();

export default DOMControllerModule;