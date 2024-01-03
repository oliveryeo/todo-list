import './styles.css';
import DOMControllerModule from './DOMController.js'; // Since the module pattern is imported, the code in the module will run immediately.

// Adds a mock todo into the todoController
DOMControllerModule.testUnitHandler.addTodoTestUnit();

// Initialize initial page load
DOMControllerModule.pageInitializationHandler.initializePage();

// Initialize dynamic page handler
DOMControllerModule.pageDynamicHandler.handleDOMReloading();

