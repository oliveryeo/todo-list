import { isWithinInterval } from 'date-fns';

// todoController module
const todoController = (() => {
  // Array to hold for all todo projects
  const allProjects = [];

  // Create a project
  const createProject = (name) => {
    allProjects.push(newProject(name));
  }

  // Extract todos from All tasks, Today, Next 7 days or a specific project
  const extractTodos = (tabTitle) => {
    if (tabTitle == "All tasks") {
      return extractAllTodos();
    } else if (tabTitle == "Today") {
      return extractTodayTodos();
    } else if (tabTitle == "Next 7 days") {
      return extractWeekTodos();
    } else {
      return extractProjectTodos(tabTitle);
    }

    // Function to extract all todos from all projects
    function extractAllTodos() {
      const allProjectsTodos = [];
      // In each project's todo, push todo to allProjectTodos
      allProjects.forEach((project) => {
        project.allTodos.forEach((todo) => {
          allProjectsTodos.push(todo);
        });
      });
      return allProjectsTodos;
    };
    
    // Function to extract today todos from all projects
    function extractTodayTodos() {
      // Create an array that holds all the today's todos
      const allTodayTodos = [];
      // Create a variable that holds today's date
      const todayDate = new Date();
      // Extract all todos that fall within today's date and push them into the array
      allProjects.forEach((project) => {
        project.allTodos.forEach((todo) => {
          if (todo.dueDate.toDateString() == todayDate.toDateString()) {
            allTodayTodos.push(todo);
          }
        })
      })

      return allTodayTodos;
    };

    // Function to extract week todos from all projects
    function extractWeekTodos() {
      // Create an array that holds all the week's todos
      const allWeekTodos = [];
      const todayDate = new Date();
      // Create a variable that holds Monday's and Sunday's date for the current week
      const mondayDate = getMonday(todayDate);
      const sundayDate = getSunday(todayDate);

      // Extract all the todos that fall between the Monday and Sunday date and push them into the array. .toDateString() is used to extract date without timestamp.
      allProjects.forEach((project) => {
        project.allTodos.forEach((todo) => {
          // console.log("test");
          // console.log(isWithinInterval(todayDate, {start: mondayDate, end: sundayDate}));
          if (isWithinInterval(todo.dueDate,
            {start: mondayDate, end: sundayDate})) {
            allWeekTodos.push(todo);
          }
        })
      });

      return allWeekTodos;

      // Functions
      function getMonday(d) {
        let day = d.getDay();
        let diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff));
      }

      function getSunday(d) {
        let day = d.getDay();
        let diff = d.getDate() - day + (day == 0 ? 0 : 7);
        return new Date(d.setDate(diff));
      }
    };

    // Function to extract todoArray from a specific project
    function extractProjectTodos(projectName) {
      // .forEach() cannot be used here because the loop will continue running even after the todos array is returned.
    for (let i = 0; i < allProjects.length; i++) {
      if (allProjects[i].projectName == projectName) {
        // console.log("Below is the array extracted");
        // console.log(allProjects[i].allTodos);
        return allProjects[i].allTodos;
      }
    }
  }
  };

  const extractTodoCount = (tabTitle) => {
    const todoArray = extractTodos(tabTitle);
    const numberOfTodos = todoArray.length;
    let checkedTodos = 0;

    // Count number of checkedTodos
    todoArray.forEach(todo => {
      if (todo.isChecked) {
        checkedTodos++;
      }
    })

    return numberOfTodos - checkedTodos;
  }
  
  return {
    get allProjects() {
      return allProjects;
    },
    createProject,
    extractTodos,
    extractTodoCount
  };
})();

// Factory function for new todo Projects
const newProject = (name) => {
  // Takes in the project name and sets it
  let projectName = name;

  // An array that stores all the todos related to this project
  const allTodos = [];

  const createTodo = (title, description, dueDate, priority, parentProject) => {
    allTodos.push(newTodo(title, description, dueDate, priority, parentProject));
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
      return projectName;
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
const newTodo = (title, description, dueDate, priority, parentProject) => {
  let todoTitle = title;
  let todoDescription = description;
  let todoDueDate = new Date(dueDate); // "YYYY-MM-DD"
  let todoPriority = priority;
  let todoParentProject = parentProject;
  let todoIsChecked = false;

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
    set dueDate(newDueDate) {
      todoDueDate = newDueDate;
    },

    get priority() {
      return todoPriority;
    },
    set priority(newPriority) {
      todoPriority = newPriority;
    },

    get parentProject() {
      return todoParentProject;
    },
    set parentProject(newParentProject) {
      todoParentProject = newParentProject;
    },

    get isChecked() {
      return todoIsChecked;
    },
    set isChecked(bool) {
      todoIsChecked = bool;
    }
  };
};

export default todoController;