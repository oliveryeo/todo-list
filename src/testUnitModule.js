import todoController from './todoController.js';

const projectCreationTestUnit = (() => {
  const createProjectX = () => {
    // Testing todo project creation
    todoController.createProject("Project-X");
  }

  const createProjectXTodo = () => {
    todoController.allProjects.forEach((project) => {
      // Sieve out the project name
      if (project.projectName == "Project-X") {
        console.log("If this is printed, Project-X was created!");
        console.log("Creating a Project-X exercise todo now for testing!");
        
        // Create a project todo
        let title = "Controlled push-ups";
        let description = "Control the descent of the push-ups for each repetition";
        let dueDate = "2023-12-27";
        let priority = "high";
        project.createTodo(title, description, dueDate, priority, project.projectName);

        let titleTwo = "Controlled dips";
        let descriptionTwo = "Control the descent of the dips, then push all the way up, look straight ahead";
        let dueDateTwo = "2023-12-28";
        let priorityTwo = "high";
        project.createTodo(titleTwo, descriptionTwo, dueDateTwo, priorityTwo, project.projectName);
      }
    });

    todoController.allProjects.forEach((project) => {
      // Sieve out the project name
      if (project.projectName == "Project-X") {
        project.allTodos.forEach((todo) => {
          console.log("If this is printed, a Project-X todo was successfully created!");
          console.log(todo);
        })
      }
    });
  }

  const createProjectY = () => {
    // Testing todo project creation
    todoController.createProject("Project-Y");
  }

  const createProjectYTodo = () => {
    todoController.allProjects.forEach((project) => {
      // Sieve out the project name
      if (project.projectName == "Project-Y") {
        console.log("If this is printed, Project-Y was created!");
        console.log("Creating a Project-Y todo now for testing!");
        
        // Create a project todo
        let title = "Buy a GoPro Hero 11";
        let description = "Lazada have a good sale going on right now!";
        let dueDate = "2024-01-01";
        let priority = "medium";
        project.createTodo(title, description, dueDate, priority, project.projectName);

        let titleTwo = "Buy GoPro Hero 11 accessories";
        let descriptionTwo = "Aliexpress have good sales on the GoPro Hero accessories!";
        let dueDateTwo = "2024-01-01";
        let priorityTwo = "low";
        project.createTodo(titleTwo, descriptionTwo, dueDateTwo, priorityTwo, project.projectName);
      }
    });

    todoController.allProjects.forEach((project) => {
      // Sieve out the project name
      if (project.projectName == "Project-Y") {
        project.allTodos.forEach((todo) => {
          console.log("If this is printed, a Project-Y todo was successfully created!");
          console.log(todo);
        })
      }
    });
  }

  return { 
    createProjectX,
    createProjectXTodo,
    createProjectY,
    createProjectYTodo
  };
})();

const testUnitModule = (() => {
  return { projectCreationTestUnit };
})();

export default testUnitModule;