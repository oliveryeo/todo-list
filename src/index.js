import './styles.css';
import DOMController from './DOMController.js'; // Since the module pattern is imported, the code in the module will run immediately.

DOMController.initializePage();

// Adds a mock todo into the todoController
DOMController.addTodoTestUnit();

