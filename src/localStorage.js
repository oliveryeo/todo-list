/**
 * Store array of todos upon page closure
 */
const storeNewTodo = (title, description, dueDate, priority, parentProject) => {
  // Extract todoStorage from localStorage and add the new todo
  const todoStorage = JSON.parse(window.localStorage.getItem('todoStorage'));
  const newTodo = [title, description, dueDate, priority, parentProject];
  todoStorage.push(newTodo);

  // Update localStorage with the new todo array
  const updatedTodoStorage = JSON.stringify(todoStorage);
  window.localStorage.setItem("todoStorage", updatedTodoStorage);
};

/**
 * Delete todo when deleted in page
 */
const deleteTodo = (projectName, todoTitle) => {
  // Extract todoStorage
  const todoStorage = JSON.parse(window.localStorage.getItem('todoStorage'));

  // Loop through and see if the todo array matches the title and project name → Splice it
  for (let i = 0; i < todoStorage.length; i++) {
    if (todoStorage[i][0] == todoTitle && todoStorage[i][4] == projectName) {
      todoStorage.splice(i, 1);
    }
  }

  // Update localStorage with the new todo array
  const updatedTodoStorage = JSON.stringify(todoStorage);
  window.localStorage.setItem("todoStorage", updatedTodoStorage);
}

/**
 * Load array of todos upon page opening
 */
const getTodoStorage = () => {
  // Extract todoStorage
  return JSON.parse(window.localStorage.getItem('todoStorage'));
};

// Module for localStorage for exportation
const localStorage = (() => {
  return {
    storeNewTodo,
    deleteTodo,
    getTodoStorage
  }
})();

export default localStorage;