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
const task = new Task('Visit Grandma after Lockdown', 'Visit grandma. Don\'t forget to be hungry! There will be lots of cake!', 1, new Date(2020, 7, 5));
toDoManager.addTask(task);
const task2 = new Task('Visit Tabea after Lockdown', 'bring pizza und Zeitverbrechen (Zeitschrift nicht Podcast', 1, new Date(2020, 7, 5));
toDoManager.addTask(task2);
toDoManager.displayList();
