import './styles.css';
import todoController from './todoController.js';
import screenController from './screenController.js';

console.log("Good Morning!");

todoController.createProject("Workout");
todoController.allProjects.forEach((project) => {
  // Sieve out the project name
  if (project.projectName == "Workout") {
    console.log("If this is printed, Workout Project was created!");
    console.log("Creating a workout exercise todo now for testing!");
    let title = "Controlled push-ups";
    let description = "Control the descent of the push-ups for each repetition";
    let dueDate = "28 Nov 2023";
    let priority = "high";
    project.createTodo(title, description, dueDate, priority);
  }
});

todoController.allProjects.forEach((project) => {
  // Sieve out the project name
  if (project.projectName == "Workout") {
    project.allTodos.forEach((todo) => {
      console.log("If this is printed, todo was successfully created!");
      console.log(todo);
    })
  }
});