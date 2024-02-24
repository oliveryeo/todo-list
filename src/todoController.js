import { isToday, isThisWeek } from 'date-fns';
import localStorage from './localStorage';

// todoController module
const todoController = (() => {
  // Array to hold for all todo projects
  const allProjects = [];

  /**
   *  Create a project
   */ 
  const createProject = (name) => {
    allProjects.push(newProject(name));
  }

  /**
   * Delete a project
   */
  const deleteProject = (name) => {
    for (let i = 0; i < allProjects.length; i++) {
      if (allProjects[i].projectName == name) {
        allProjects.splice(i, 1);
      }
    }
  }

  /**
   * Extract a project
   */
  const extractProject = (name) => {
    for (let i = 0; i < allProjects.length; i++) {
      if (allProjects[i].projectName == name) {
        return allProjects[i];
      }
    }
  }

  /**
   * Extract todos from All tasks, Today, Next 7 days or a specific project
   */
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
      // Extract all todos that fall within today's date and push them into the array
      allProjects.forEach((project) => {
        project.allTodos.forEach((todo) => {
          if (isToday(todo.dueDate)) {
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

      // Extract all the todos that fall between the Monday and Sunday date and push them into the array. .toDateString() is used to extract date without timestamp.
      allProjects.forEach((project) => {
        project.allTodos.forEach((todo) => {
          if (isThisWeek(todo.dueDate)) {
            allWeekTodos.push(todo);
          }
        })
      });

      return allWeekTodos;
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

  /**
   * Extract the number of todos that are unchecked
   */
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

  /**
   * Load the todos based on localStorage data
   */
  const loadTodos = () => {
    const todoStorage = localStorage.getTodoStorage();
    createParentProjects();
    createTodos();

    /**
     * Create parentProjects
     */
    function createParentProjects() {
      // Create a array of parentProjects:
      let parentProjectsArray = [];

      for (let i = 0; i < todoStorage.length; i++) {
        // If parentProjectsArray does not have the parentProject title → Add into the array
        if (!parentProjectsArray.includes(todoStorage[i][4])) {
          parentProjectsArray.push(todoStorage[i][4]);
        }
      }

      // Create parentProjects
      for (let i = 0; i < parentProjectsArray.length; i++) {
        createProject(parentProjectsArray[i]);
      }
    }
    
    /**
     * Create todos for the respective parent projects
     */
    function createTodos() {
      // Loop through each parentProject
      for (let i = 0; i < allProjects.length; i++) {
        // Loop through each todo and add the todo if the parentProject matches
        let loopedProject = allProjects[i];
        for (let j = 0; j < todoStorage.length; j++) {
          let loopedTodo = todoStorage[j];

          // Check if projectName matches
          if (loopedProject.projectName == loopedTodo[4]) {
            console.log(loopedTodo[4]);
            console.log("Project name matched")
            // Check if the todo already exists
            let projectTodos = loopedProject.allTodos;

            // If the projectTodo is empty, add the loopedTodo
            if (projectTodos.length == 0) {
              console.log("Empty todolist, adding the todo");
              loopedProject.createTodo(loopedTodo[0], loopedTodo[1], loopedTodo[2], loopedTodo[3], loopedTodo[4]);
              continue;
            }

            // If projectTodo is not empty, check if the todo already exist by comparing the todo title. Note loopedTodo[0] is the todo title
            for (let k = 0; k < projectTodos.length; k++) {
              if (projectTodos[k].title != loopedTodo[0]) {
                loopedProject.createTodo(loopedTodo[0], loopedTodo[1], loopedTodo[2], loopedTodo[3], loopedTodo[4]);
              }
            }
          }
        }
      }
    }
    

  }
  
  return {
    get allProjects() {
      return allProjects;
    },
    createProject,
    deleteProject,
    extractProject,
    extractTodos,
    extractTodoCount,
    loadTodos
  };
})();

// Factory function for new todo Projects
const newProject = (name) => {
  // Takes in the project name and sets it
  let _projectName = name;

  // An array that stores all the todos related to this project
  const _allTodos = [];

  const createTodo = (title, description, dueDate, priority, parentProject) => {
    _allTodos.push(newTodo(title, description, dueDate, priority, parentProject));
  }

  const deleteTodo = (todoTitle) => {
    for (let i = 0; i < _allTodos.length; i++) {
      if (_allTodos[i].title == todoTitle) {
        // Remove the todo from project object
        _allTodos.splice(i, 1);
        return;
      }
    }
  };

  return {
    // Project name getter
    get projectName() {
      return _projectName;
    },
    // Project name setter
    set projectName(newName) {
      _projectName = newName;
    },
    // Getter for all of the project's todos
    get allTodos() {
      return _allTodos;
    },
    // Todo creator and deletor
    createTodo,
    deleteTodo
  };
};

// Factory function for new Todos
const newTodo = (title, description, dueDate, priority, parentProject) => {
  let _todoTitle = title;
  let _todoDescription = description;
  let _todoDueDate = new Date(dueDate); // "YYYY-MM-DD"
  let _todoPriority = priority;
  let _todoParentProject = parentProject;
  let _todoIsChecked = false;

  return {
    get title() {
      return _todoTitle;
    },
    set title(newTitle) {
      _todoTitle = newTitle;
    },
    
    get description() {
      return _todoDescription;
    },
    set description(newDescription) {
      _todoDescription = newDescription;
    },

    get dueDate() {
      return _todoDueDate;
    },
    set dueDate(newDueDate) {
      _todoDueDate = newDueDate;
    },

    get priority() {
      return _todoPriority;
    },
    set priority(newPriority) {
      _todoPriority = newPriority;
    },

    get parentProject() {
      return _todoParentProject;
    },
    set parentProject(newParentProject) {
      _todoParentProject = newParentProject;
    },

    get isChecked() {
      return _todoIsChecked;
    },
    set isChecked(bool) {
      _todoIsChecked = bool;
    }
  };
};

export default todoController;