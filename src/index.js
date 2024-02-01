import './styles.css';
import DOMControllerModule from './DOMController.js'; // Since the module pattern is imported, the code in the module will run immediately.
import allTasksIcon from "./icons/tray-full.svg";
import todayTasksIcon from "./icons/weather-sunny.svg";
import weekTasksIcon from "./icons/calendar-week.svg";
import projectHeaderIcon from "./icons/lightbulb-on-outline.svg";

// Adds a mock todo into the todoController
DOMControllerModule.testUnitHandler.addTodoTestUnit();

// Initialize initial page load
DOMControllerModule.pageInitializationHandler.initializePage();

// Load static images for webpack in template.html
const allTasks = document.querySelector("#home > button[data-title='All tasks'] > img");
allTasks.src = allTasksIcon;

const todayTasks = document.querySelector("#home > button[data-title='Today'] > img");
todayTasks.src = todayTasksIcon;

const weekTasks = document.querySelector("#home > button[data-title='Next 7 days'] > img");
weekTasks.src = weekTasksIcon;

const projectHeader = document.querySelector("#project-header > img");
projectHeader.src = projectHeaderIcon;

