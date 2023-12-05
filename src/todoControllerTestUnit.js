import todoController from './todoController.js';

const todoControllerTestUnit = () => {
  // Testing todo project creation
  todoController.createProject("Project-X");
  todoController.allProjects.forEach((project) => {
    // Sieve out the project name
    if (project.projectName == "Project-X") {
      console.log("If this is printed, Project-X was created!");
      console.log("Creating a Project-X exercise todo now for testing!");
      let title = "Controlled push-ups";
      let description = "Control the descent of the push-ups for each repetition";
      let dueDate = "28 Nov 2023";
      let priority = "high";
      project.createTodo(title, description, dueDate, priority);
    }
  });

  todoController.allProjects.forEach((project) => {
    // Sieve out the project name
    if (project.projectName == "Project-X") {
      project.allTodos.forEach((todo) => {
        console.log("If this is printed, todo was successfully created!");
        console.log(todo);
      })
    }
  });
};

export default todoControllerTestUnit;