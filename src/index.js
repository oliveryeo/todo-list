import './styles.css';
import DOMControllerModule from './DOMController.js'; // Since the module pattern is imported, the code in the module will run immediately.

// Adds a mock todo into the todoController
DOMControllerModule.addTodoTestUnit();

// Initialize 
DOMControllerModule.initializePage();


