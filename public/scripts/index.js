import ToDoManager from './models/todomanager.js';
import View, { TaskLists } from './view/view.js';
import propertyStorage from './models/data/property-storage-manager.js';

const toDoManager = new ToDoManager();

const view = new View(toDoManager);
view.updateView();

/* dark theme toggle */
function toggleDarkTheme(event) {
    if (event.target.value === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }
    propertyStorage.storeProperties(event.target.value);
}

const selectTheme = document.querySelector('[data-theme]');
/* load theme from storage */
if (propertyStorage.getProperties().theme === 'light') {
    document.body.classList.remove('dark-theme');
    selectTheme.value = 'light';
} else {
    document.body.classList.add('dark-theme');
    selectTheme.value = 'dark';
}

selectTheme.addEventListener('change', (event) => toggleDarkTheme(event));

/* select current task list */
const selectTasks = document.querySelector('[data-task-list-choice]');
selectTasks.value = 'dueTasks';
selectTasks.addEventListener('change', (event) => {
    switch (event.target.value) {
        case 'dueTasks':
            view.setCurrentTaskList(TaskLists.dueTasks);
            break;
        case 'finishedTasks':
        view.setCurrentTaskList(TaskLists.finishedTasks);
            break;
        default:
            // eslint-disable-next-line no-console
            console.error(`unknown TaskList: ${event.target.value}`);
            view.setCurrentTaskList(TaskLists.dueTasks);
            break;
    }
});

const selectSort = document.querySelector('[data-task-sort-choice');
selectSort.value = '0';
selectSort.addEventListener('change', (event) => {
    view.updateView(Number(event.target.value));
});
