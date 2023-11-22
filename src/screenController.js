import todoController from './todoController.js';

// screenController Module
const screenController = (() => {
  const newProject = document.querySelector("#new-project");

  newProject.addEventListener("click", () => {
    alert("Hello!");
  });
})();

export default screenController;