# todo-list
TOP Project on Todo-list

# Goal of the project
- Demonstrate the use of local storage to store current todos
- Demonstrate the use of webpack in this project
- Consolidate knowledge on styling design, javascript DOM manipulation, and project planning

# Technologies used
- HTML
- CSS
- Browser's localStorage property
- JavaScript (ES6 Modules)
- Webpack
- Date-fns library
- Git

# Takeaways from this project
<ins>The conflict between flexbox and justify-self</ins>
- I had an issue of trying to ensure that the todo counts were flushed to the right of the sidebar-panel because flexbox disables justify-self due to the nature of the tool, where it groups and justify all the elements as a whole.
- To fix this, I had to employ the margin-left: auto strategy to fill the gaps with margins for the todo counts, flushing the counts to the right of the sidebar panel.

<ins>The conflict between the use of .forEach() and for loop</ins>
- An issue arose when I was trying to extract the number of todos for a specific project in order to update the todo count in the sidebar. A conditional logic was put in place to match the correct project name to extract the todos. <b>Undefined</b> was returned when .forEach() was used to extract the todo array for the specific project.
- Later, I found out that .forEach() does not terminate the loop even after the "return" keyword is invoked. https://medium.com/front-end-weekly/3-things-you-didnt-know-about-the-foreach-loop-in-js-ff02cec465b1
- .forEach() is replaced with a normal for loop for the specific portion on extracted the array of todos for a specific project.

<ins>Practicing the principle of Single Responsibility</ins>
- I had a dilemma on whether I should combine what happens in the sidebar and mainbar in an overarching Module Pattern called the DOMController.
- However, I decided that I should separate the sidebar DOM logic from the mainbar DOM logic, and is an intermediary DOMController logic to bring together the sidebar and mainbar DOM logic.
- This way, the sidebar logic is hidden from the mainbar logic.

# Things that can be improved
<ins>sidebarController.js's projectController Module Pattern</ins>
- A big issue I had with the projectController Module Pattern was that the dynamic creation of inputField requires an entire re-initiation of event listeners for the "My Projects" section of the webpage in the createInputField function itself.
- This was because whenever a new project was created, the whole "My Projects" section will be wiped out and replaced with the updated list of projects as invoked by the _updateProjectDisplay() helper function. Therefore, the re-initiation of event listeners are required.
- However, based on the logic of the new project creation, the inputField is created and dissolved on its own, which means that it can't be selected whenever it dynamically pops out. This also means that we can't add an event listener externally to track whenever a new project is created, which also means we can't run the re-initiation of event listeners externally (outside of the loadNewProjectUI() code).
- Therefore, all the re-initiation of event listeners had to be done INTERNALLY in the loadNewProjectUI()'s createInputField() code, which means that there will be a LOT of dependencies going on in this code between the sidebarController() and mainbarController().

<ins>Planning of Modules in the project</ins>
- At this point in time (27 Feb 2024) I have completed the project. However, I felt that many modules were dependent on one another (e.g. mainbarController module required a lot of importation from other modules for it to work seamlessly). One thing I could improve is using a single module to consolidate ALL the other modules to help make the dynamics of the page work.

<ins>Optimization for different screen size</ins>
- There were feedback on visibility issues for smaller screen sizes. Another improvement can be made such that the web app is compatible with smaller screen sizes and mobile devices.
