import todoController from './todoController.js';
import { format } from "date-fns";

/* 
  Module pattern that takes in the sidebar tab title and todo array
  and load into main bar view.
*/
const mainbarController = (() => {
  const loadMainbar = () => {
    // Select all tab buttons -> extract title and array -> load mainbar UI
    const allTabButtons = document.querySelectorAll("#home > button, #projects > button");
    allTabButtons.forEach(tabButton => {
      tabButton.addEventListener('click', () => {
        // Initiate relevant variables
        const tabDataTitle = tabButton.dataset.title;
        let todoArray;
        // Conditions to sieve out todoArray from all tasks, today, next 7 days, or projects
        if (tabDataTitle == 'All tasks') {
          todoArray = todoController.extractAllTodos();
        } else if (tabDataTitle == 'Today') {
          todoArray = todoController.extractTodayTodos();
        } else if (tabDataTitle == 'Next 7 days') {
          todoArray = todoController.extractWeekTodos();
        } else {
          todoArray = todoController.extractProjectTodos(tabDataTitle);
        };

        _mainbarUIHandler(tabDataTitle, todoArray);

      });
    })
  };

  function _mainbarUIHandler(tabDataTitle, todoArray) {
    // Select .main-panel-title-content class -> change text content to tabTitle AND set the data-title attribute to tabTitle as well
    const mainPanelTitle = document.querySelector("#main-panel-title-content");
    mainPanelTitle.textContent = tabDataTitle;
    // Select #main-panel-content id:
    const mainPanelContent = document.querySelector("#main-panel-content");
      // Clear out ALL the todos on the page
    mainPanelContent.textContent = "";
      // Using the todoArray, create:
    todoArray.forEach(todo => {
        // A button with data-todo attribute of the todo title
      const todoButton = document.createElement('button');
      todoButton.dataset.title = todo.title;

        // An input of checkbox type
      const checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');

        // A div containing the todo title as the content
      const todoTitle = document.createElement('div');
      todoTitle.textContent = todo.title;
        // A div with a class .todo-due-date, inside which contains:
          // An img with the triangle flag
          // A div containing the todo due date as the content
      const todoDueDateContainer = document.createElement('div');
      todoDueDateContainer.classList.add("todo-due-date");
      const dueFlagImg = document.createElement('img');
      dueFlagImg.setAttribute("src", "./icons/flag-triangle.svg");
      const todoDueDate = document.createElement('div');
      todoDueDate.textContent = format(todo.dueDate, "dd MMM");
      todoDueDateContainer.appendChild(dueFlagImg);
      todoDueDateContainer.appendChild(todoDueDate);

        // Joining everything together
      todoButton.appendChild(checkbox);
      todoButton.appendChild(todoTitle);
      todoButton.appendChild(todoDueDateContainer);
      mainPanelContent.appendChild(todoButton);
    })    
  };
  
  return {
    loadMainbar
  }
})();

export default mainbarController;