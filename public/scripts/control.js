import ToDoManager from './models/todomanager.js';
import View from './view.js';
import Popup from './popup.js';

const toDoManager = new ToDoManager();
const view = new View(toDoManager);
const addNewCardPopup = new Popup(view, toDoManager);
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

const warningPopup = document.querySelector('[data-warning-popup]');
let callbackFunctionOnCloseWarning = null;
let callbackFunctionOnConfirmWarning = null;

document.querySelector('[data-warning-confirm]').addEventListener('click', () => {
    if (callbackFunctionOnConfirmWarning != null) {
        callbackFunctionOnConfirmWarning();
    }

    warningPopup.style.display = 'none';
});

document.querySelectorAll('[data-warning-cancel]').forEach((btn) => btn.addEventListener('click', () => {
    if (callbackFunctionOnCloseWarning != null) {
        callbackFunctionOnCloseWarning();
    }

    warningPopup.style.display = 'none';
}));

export default function showWarningPopUp(title, msg, callbackOnYes, callBackOnNo) {
    warningPopup.style.display = 'block';
    document.querySelector('[data-warning-title]').textContent = title;
    document.querySelector('[data-warning-msg]').textContent = msg;
    callbackFunctionOnConfirmWarning = callbackOnYes;
    callbackFunctionOnCloseWarning = callBackOnNo;
}

const addTaskBtn = document.querySelectorAll('[data-add-task]');
const closeBtns = document.querySelectorAll('[data-close-popup]');

addTaskBtn.forEach((button) => button.addEventListener('click', () => addNewCardPopup.show(true)));
closeBtns.forEach((item) => item.addEventListener('click', () => showWarningPopUp('Are sure you want to cancel?', 'By answering yes you you loose all the data entered in the form', () => addNewCardPopup.show(false))));
