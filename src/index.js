import './styles.css';
import DOMControllerModule from './DOMController.js'; // Since the module pattern is imported, the code in the module will run immediately.

DOMControllerModule.initializePage();

// Adds a mock todo into the todoController
DOMControllerModule.addTodoTestUnit();

