import todoController from './todoController.js';

const todoControllerTestUnit = () => {
  // Testing todo project creation
  todoController.createProject("Project-X");
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
      project.createTodo(title, description, dueDate, priority);

      let titleTwo = "Controlled dips";
      let descriptionTwo = "Control the descent of the dips, then push all the way up, look straight ahead";
      let dueDateTwo = "2023-12-28";
      let priorityTwo = "high";
      project.createTodo(titleTwo, descriptionTwo, dueDateTwo, priorityTwo);
    }
  });

  todoController.allProjects.forEach((project) => {
    // Sieve out the project name
    if (project.projectName == "Project-X") {
      project.allTodos.forEach((todo) => {
        console.log("If this is printed, a todo was successfully created!");
        console.log(todo);
      })
    }
  });
};

export default todoControllerTestUnit;