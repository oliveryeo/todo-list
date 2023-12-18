# todo-list
TOP Project on Todo-list

# Goal of the project
- Demonstrate the use of local storage to store current todos
- Demonstrate the use of webpack in this project
- Consolidate knowledge on styling design, javascript DOM manipulation, and project planning

# Takeaways from this project
<ins>The conflict between flexbox and justify-self</ins>
- I had an issue of trying to ensure that the todo counts were flushed to the right of the sidebar-panel because flexbox disables justify-self due to the nature of the tool, where it groups and justify all the elements as a whole.
- To fix this, I had to employ the margin-left: auto strategy to fill the gaps with margins for the todo counts, flushing the counts to the right of the sidebar panel.

<ins>The conflict between the use of .forEach() and for loop</ins>
- An issue arose when I was trying to extract the number of todos for a specific project in order to update the todo count in the sidebar. A conditional logic was put in place to match the correct project name to extract the todos. <b>Undefined</b> was returned when .forEach() was used to extract the todo array for the specific project.
- Later, I found out that .forEach() does not terminate the loop even after the "return" keyword is invoked. https://medium.com/front-end-weekly/3-things-you-didnt-know-about-the-foreach-loop-in-js-ff02cec465b1
- .forEach() is replaced with a normal for loop for the specific portion on extracted the array of todos for a specific project.