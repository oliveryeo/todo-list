// todoController module
const todoController = (() => {
  // Array to hold for all todo projects
  const allProjects = [];

  // Create a project
  const createProject = (name) => {
    allProjects.push(newProject(name));
  }

  // TODO: Function to extract all todos from all projects
  const extractAllTodos = () => {
    const allProjectTodos = [];
    // In each project's todo, push todo to allProjectTodos
    allProjects.forEach((project) => {
      project.allTodos.forEach((todo) => {
        allProjectTodos.push(todo);
      });
    });
    return allProjectTodos;
  };

  // TODO: Function to extract week todos from all projects
  const extractWeekTodos = () => {
    // Create an array that holds all the week's todos
    // Create a variable that holds Monday's date for the current week
    // Create a variable that holds the Sunday's date for the current week
    // Extract all the todos that fall between the Monday and Sunday date and push them into the array
  };

  // TODO: Function to extract today todos from all projects
  const extractTodayTodos = () => {
    // Create an array that holds all the today's todos
    // Create a variable that holds today's date
    // Extract all todos that fall within today's date and push them into the array
  };
  
  return {
    get allProjects() {
      return allProjects;
    },
    createProject,
    extractAllTodos,
    extractWeekTodos,
    extractTodayTodos
  };
})();

// Factory function for new todo Projects
const newProject = (name) => {
  // Takes in the project name and sets it
  let projectName = name;

  // An array that stores all the todos related to this project
  const allTodos = [];

  const createTodo = (title, description, dueDate, priority) => {
    allTodos.push(newTodo(title, description, dueDate, priority));
  }

  const deleteTodo = (todoTitle) => {
    allTodos.forEach((todo, index) => {
      if (todoTitle == todo) {
        allTodos.splice(index, 1);
      }
    });
  };

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
    // Todo creator and deletor
    createTodo,
    deleteTodo
  };
};

// Factory function for new Todos
const newTodo = (title, description, dueDate, priority) => {
  let todoTitle = title;
  let todoDescription = description;
  let todoDueDate = new Date(dueDate);
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
  };
};

export default todoController;