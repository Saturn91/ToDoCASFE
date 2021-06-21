import ToDoManager from './models/todomanager.js';
import View, { SortTypes } from './view/view.js';
import propertyStorage from './models/data/property-storage-manager.js';

const toDoManager = new ToDoManager();

const view = new View(toDoManager);
view.updateView();

/* sort and display btns */
document.querySelector('[data-sort-duedate-btn]').addEventListener('click', () => view.updateView(SortTypes.dueDate));
document.querySelector('[data-sort-created-btn]').addEventListener('click', () => view.updateView(SortTypes.createdDate));
document.querySelector('[data-sort-importance]').addEventListener('click', () => view.updateView(SortTypes.importance));
document.querySelector('[data-show-finished-btn]').addEventListener('click', () => view.updateView(SortTypes.finished));

/* dark theme toggle */
function toggleDarkTheme(event) {
    if (event.target.value === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }
    propertyStorage.storeProperties(event.target.value);
}

const selectTheme = document.querySelector('[data_theme]');
/* load theme from storage */
if (propertyStorage.getProperties().theme === 'light') {
    document.body.classList.remove('dark-theme');
    selectTheme.value = 'light';
} else {
    document.body.classList.add('dark-theme');
    selectTheme.value = 'dark';
}

selectTheme.addEventListener('change', (event) => toggleDarkTheme(event));
