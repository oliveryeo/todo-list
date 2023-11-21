// Create a todoController module
const todoController = (() => {
  // Create an array to hold for all todo projects
  const allProjects = [];

  const createProject = (name) => {
    allProjects.push(newProject(name));
  }
  
  return {
    get allProjects() {
      return allProjects;
    },
    createProject
  }
})();

// Create a factory function that creates a todo project
const newProject = (name) => {
  // Takes in the project name and sets it
  let projectName = name;

  // An array that stores all the todos related to this project
  const allTodos = [];

  const createTodo = (title, description, dueDate, priority) => {
    allTodos.push(newTodo(title, description, dueDate, priority));
  }

  return {
    // Project name getter
    get projectName() {
      return name;
    },
    // Project name setter
    set projectName(newName) {
      projectName = newName;
    },
    // Getter for all of the project's todos
    get allTodos() {
      return allTodos;
    },
    // Todo creator
    createTodo
  }
};

// Create a todo factory function
const newTodo = (title, description, dueDate, priority) => {
  let todoTitle = title;
  let todoDescription = description;
  let todoDueDate = dueDate;
  let todoPriority = priority;

  return {
    get title() {
      return todoTitle;
    },
    set title(newTitle) {
      todoTitle = newTitle;
    },
    
    get description() {
      return todoDescription;
    },
    set description(newDescription) {
      todoDescription = newDescription;
    },

    get dueDate() {
      return todoDueDate;
    },
    set dueDate(newDate) {
      todoDueDate = newDate;
    },

    get priority() {
      return todoPriority;
    },
    set priority(newPriority) {
      todoPriority = newPriority;
    }
  }
};

export default todoController;