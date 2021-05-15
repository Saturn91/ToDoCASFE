import Task from './models/task.js';
import ToDoManager from './models/todomanager.js';

function toggleDarkTheme(event) {
    if (event.target.value === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }
}

const selectTheme = document.querySelector('[data_theme]');
selectTheme.addEventListener('change', (event) => toggleDarkTheme(event));

const toDoManager = new ToDoManager();
const task = new Task('my Title', 'my Description which is very long', 1);
toDoManager.addTask(task);
console.log(toDoManager.toString());
