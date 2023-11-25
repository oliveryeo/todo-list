import './styles.css';
import screenController from './screenController.js'; // Since the module pattern is imported, the code in the module will run immediately.

screenController.initializePage();

// Adds a mock todo into the todoController
screenController.addTodoTestUnit();

