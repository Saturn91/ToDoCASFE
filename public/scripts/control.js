import ToDoManager from './models/todomanager.js';
import View from './view.js';
import PopupService from './view/popup-service.js';
import showWarningPopUp from './view/warning-popup.js';

const toDoManager = new ToDoManager();
const view = new View(toDoManager);
const addNewCardPopup = new PopupService(view, toDoManager);
addNewCardPopup.show(false);
view.updateView(view.displayType.createdDate);

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

const addTaskBtn = document.querySelectorAll('[data-add-task]');
const closeBtns = document.querySelectorAll('[data-close-popup]');

addTaskBtn.forEach((button) => button.addEventListener('click', () => addNewCardPopup.show(true)));
closeBtns.forEach((item) => item.addEventListener('click', () => showWarningPopUp('Are sure you want to cancel?', 'By answering yes you you loose all the data entered in the form', () => addNewCardPopup.show(false))));