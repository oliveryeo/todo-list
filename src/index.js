import './styles.css';
import todoController from './todoController.js';
import DOMControllerModule from './DOMController.js'; // Since the module pattern is imported, the code in the module will run immediately.
import allTasksIcon from "./icons/tray-full.svg";
import todayTasksIcon from "./icons/weather-sunny.svg";
import weekTasksIcon from "./icons/calendar-week.svg";
import projectHeaderIcon from "./icons/lightbulb-on-outline.svg";
import newProjectIcon from "./icons/plus.svg";

// Initiate todo localStorage array if does not exist
if (localStorage.getItem("todoStorage") == null) {
  // Initialize a todoStorage array, stringify it, then store in localStorage
  const todoStorage = [];
  let string = JSON.stringify(todoStorage);
  localStorage.setItem("todoStorage", string);
};

// Load initial todos based on localStorage (have to be loaded AFTER all DOM elements are loaded)
todoController.loadTodos();

// Adds a mock todo into the todoController
// DOMControllerModule.testUnitHandler.addTodoTestUnit();

// Initialize initial page load
DOMControllerModule.pageInitializationHandler.initializePage();

// Load static images for webpack in template.html
const allTasksImg = document.querySelector("#home > button[data-title='All tasks'] > img");
allTasksImg.src = allTasksIcon;

const todayTasksImg = document.querySelector("#home > button[data-title='Today'] > img");
todayTasksImg.src = todayTasksIcon;

const weekTasksImg = document.querySelector("#home > button[data-title='Next 7 days'] > img");
weekTasksImg.src = weekTasksIcon;

const projectHeaderImg = document.querySelector("#project-header > img");
projectHeaderImg.src = projectHeaderIcon;

const newProjectImg = document.querySelector("#new-project > img");
newProjectImg.src = newProjectIcon;