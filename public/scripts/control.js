import ToDoManager from './models/todomanager.js';
import View from './view.js';
import Popup from './popup.js';

const toDoManager = new ToDoManager();
const view = new View(toDoManager);
const addNewCardPopup = new Popup(view, toDoManager);
addNewCardPopup.show(false);
view.updateView(view.displayType.createdDate);

const addTaskBtn = document.querySelectorAll('[data-add-task]');
const closeBtns = document.querySelectorAll('[data-close-popup]');

addTaskBtn.forEach((button) => button.addEventListener('click', () => addNewCardPopup.show(true)));
closeBtns.forEach((item) => item.addEventListener('click', () => addNewCardPopup.show(false)));

/* sort and display btns */
document.querySelector('[data-sort-duedate-btn]').addEventListener('click', () => view.updateView(view.displayType.sortDueDate));
document.querySelector('[data-sort-created-btn]').addEventListener('click', () => view.updateView(view.displayType.createdDate));
document.querySelector('[data-sort-importance]').addEventListener('click', () => view.updateView(view.displayType.sortImportance));
document.querySelector('[data-show-finished-btn]').addEventListener('click', () => view.updateView(view.displayType.showFinised));

/* dark theme toggle */
function toggleDarkTheme(event) {
    if (event.target.value === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }
}

const selectTheme = document.querySelector('[data_theme]');
selectTheme.addEventListener('change', (event) => toggleDarkTheme(event));
