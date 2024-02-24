// Store array of todos upon page closure
const storeTodo = (title, description, dueDate, priority, parentProject) => {
  // Extract todoStorage from localStorage and add the new todo
  const todoStorage = JSON.parse(localStorage.getItem('todoStorage'));
  const newTodo = [title, description, dueDate, priority, parentProject];
  todoStorage.push(newTodo);

  // Update localStorage with the new todo array
  const updatedTodoStorage = JSON.stringify(todoStorage);
  localStorage.setItem("todoStorage", updatedTodoStorage);
};

// Load array of todos upon page opening
const loadTodos = (todoStorageArray) => {

};

export {
  storeTodo,
  loadTodos
};