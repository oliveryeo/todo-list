import todoController from "./todoController.js";
import mainbarController from "./mainbarController.js";

/* 
  Tab styler module pattern 
*/
const tabStyler = (() => {
  const styleTabs = () => {
    // Select all the tabs in side bar that requires .selected-tab styling when clicked
    const allTabs = document.querySelectorAll(
      "#home > button, #projects > button"
    );
    allTabs.forEach((item) => {
      // Add or remove .selected-tab class on click for each tab
      item.addEventListener("click", () => {
        // Remove .selected-tab class from previous selected tab
        const prevSelectedTab = document.querySelector(".selected-tab");
        if (prevSelectedTab) {
          prevSelectedTab.classList.remove("selected-tab");
        }
        // Add .selected-tab class to current selected tab
        item.classList.add("selected-tab");
      });
    });
  };

  return { styleTabs };
})();

/* 
  Todo Count loader Module Pattern 
*/
const todoCountLoader = (() => {
  // Function to load todo count for all tasks tab
  const loadAllTasksCount = () => {
    // Extract count of todos from all projects
    let allTasksCount = todoController.extractTodoCount("All tasks");
    _modifyCountDisplay("All tasks", allTasksCount);
  };

  // Function to load todo count for today tasks tab
  const loadTodayTasksCount = () => {
    // Extract count of todos due today
    let todayTasksCount = todoController.extractTodoCount("Today");
    _modifyCountDisplay("Today", todayTasksCount);
  };

  // Function to load todo count for week tasks tab
  const loadWeekTasksCount = () => {
    let weekTasksCount = todoController.extractTodoCount("Next 7 days");
    _modifyCountDisplay("Next 7 days", weekTasksCount);
  };

  // Function to load task count for a specific project.
  const loadProjectTasksCount = (projectName) => {
    // Extract todo array for a specific project → If array exists, then extract count and modify count display
    let projectTodoArray = todoController.extractTodos(projectName);
    // console.log("Below is the extracted array in sidebar controller");
    // console.log(projectTodoArray);
    if (projectTodoArray) {
      let projectTasksCount = todoController.extractTodoCount(projectName);
      _modifyCountDisplay(projectName, projectTasksCount);
    }
  };

  // When a checkbox is clicked, RELOAD all the tasks count in the sidebar
  const handleDynamicTodoCount = () => {
    const todoCheckboxes = document.querySelectorAll("#main-panel-content > button > input[type='checkbox']");

    todoCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('click', () => {
        const todoButton = checkbox.parentNode;
        const todoParentProject = todoButton.dataset.parentProject;

        // Reload ALL the tasks count
        loadAllTasksCount();
        loadTodayTasksCount();
        loadWeekTasksCount();
        loadProjectTasksCount(todoParentProject);
      })
    })
  }

  // Helper function to handle DOM loading
  function _modifyCountDisplay(dataTitle, tasksCountNumber) {
    const elementDataTitle = "[" + "data-title=" + '"' + dataTitle + '"' + "]";
    const selectedElement = document.querySelector(elementDataTitle);
    const existingCountElement = document.querySelector(
      elementDataTitle + " > .count"
    );
    // If count element already exist, change the count
    if (existingCountElement) {
      existingCountElement.textContent = tasksCountNumber;
    } else {
      // else, create and append count element to the tab
      const countElement = document.createElement("div");
      countElement.classList.add("count");
      countElement.textContent = tasksCountNumber;
      selectedElement.appendChild(countElement);
    }
  }

  return {
    loadAllTasksCount,
    loadTodayTasksCount,
    loadWeekTasksCount,
    loadProjectTasksCount,
    handleDynamicTodoCount
  };
})();

/* 
  Project controller Module Pattern responsible for adding new projects
*/
const projectController = (() => {
  /* Function to handle UI for new projects */
  const loadNewProjectUI = () => {
    // Upon submission of the text input, create a new project via todoController, and update the DOM of the new project
    // Upon clicking the newproject, create a new input box and add class .new-project.input, which will overlap the new project button
    const newProjectButton = document.querySelector("#new-project");
    newProjectButton.addEventListener("click", createInputField);

    function createInputField() {
      // Remove click event listener to prevent double input field pop up
      newProjectButton.removeEventListener("click", createInputField);

      // Create new input box and add class .new-project.input
      const inputField = document.createElement("input");
      inputField.classList.add("new-project-input");
      inputField.setAttribute("type", "text");
      inputField.setAttribute("placeholder", "Project Name ('enter' to add)");

      // Add event listener to inputField -> when enter key is lifted, use that value to create a new project and remove the whole input box from the DOM
      inputField.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          // Create new project
          const newProjectName = inputField.value; // Project name
          todoController.createProject(newProjectName);

          // Remove the input field from the DOM
          inputField.remove();

          // Add back the click event listener to newProjectButton by recursion
          newProjectButton.addEventListener("click", createInputField);
          _updateTabEvents();
        }
      });

      newProjectButton.appendChild(inputField);
    }

    function _updateTabEvents() {
      // Update displayed projects
      _updateProjectDisplay();

      // Reload all sidebar events AND mainbar events - may be a bad idea to have a dependency here, but no choice → May want to refactor this into DOMController
        // Sidebar loader
      tabStyler.styleTabs();
        // Mainbar loader
      mainbarController.mainbarDisplayHandler.loadMainbar();

      // Every time a new side tab is clicked, reload todo-checkbox-event-handler for the mainbar and re-initiate todo count dynamics for sidebar
      const sidebarTabs = document.querySelectorAll(
        "#home > button, #projects > button"
      );
      sidebarTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          // Reload todo checkbox event handler
          mainbarController.mainbarEventHandler.handleTodoCheckboxEvent();
          sidebarController.todoCountLoader.handleDynamicTodoCount();
        });
      });
    }

    // Helper function that helps to load all the current projects onto the DOM
    function _updateProjectDisplay() {
      // Remove all currently displayed projects
      const currentDisplayedProjects =
        document.querySelectorAll("#projects > button");
      currentDisplayedProjects.forEach((displayedProject) =>
        displayedProject.remove()
      );

      // Loop through the updated projects
      const updatedProjects = todoController.allProjects;
      updatedProjects.forEach((project) => {
        const projectName = project.projectName;
        const todoCount = todoController.extractTodoCount(projectName);

        // Create a button with a div child (for project name), and a div child for todos count (with the class of "count"). Ensure that the button has an id of the project's name as well.
        const projectNameDisplay = document.createElement("div");
        projectNameDisplay.textContent = projectName;

        const projectTodoCount = document.createElement("div");
        projectTodoCount.classList.add("count");
        projectTodoCount.textContent = todoCount;

        const projectButton = document.createElement("button");
        projectButton.dataset.title = projectName;
        projectButton.appendChild(projectNameDisplay);
        projectButton.appendChild(projectTodoCount);

        // Append child to #projects
        const projectContainer = document.querySelector("#projects");
        projectContainer.appendChild(projectButton);
      });
    }
  };

  return {
    loadNewProjectUI,
  };
})();

/*
  Overall sidebarController Module Pattern for export
*/
const sidebarController = (() => {
  return {
    tabStyler,
    todoCountLoader,
    projectController
  }
})();

export default sidebarController;
