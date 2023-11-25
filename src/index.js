import './styles.css';
import sidebarController from './sidebarController.js'; // Since the module pattern is imported, the code in the module will run immediately.

sidebarController.initializePage();

// Adds a mock todo into the todoController
sidebarController.addTodoTestUnit();

