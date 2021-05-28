import showWarningPopUp from './warning-popup.js';
import Task from '../models/task.js';

const editTaskPopup = document.querySelector('[data-edit-popup]');
const formTitle = editTaskPopup.querySelector('input[name="title"]');
const formDescription = editTaskPopup.querySelector('textarea[name="description"]');
const formPriority = editTaskPopup.querySelector('input[name="prio"]');
const formDueDate = editTaskPopup.querySelector('input[name="duedate"]');
const warningDisplay = editTaskPopup.querySelector('[data-form-msg]');
const windowTitle = editTaskPopup.querySelector('[data-form-title]');
const submitBtn = editTaskPopup.querySelector('[data-submit-task]');

let callbackFunctionOnConfirmEditPopup = null;

function showInvalid(msg) {
    warningDisplay.style.display = 'block';
    warningDisplay.textContent = msg;
}

function checknewTaskFormValid() {
    let valid = true;
    if (!formDescription.checkValidity()) {
        showInvalid('please enter a description');
        valid = false;
    }
    if (!formPriority.checkValidity()) {
        showInvalid('priority has to be a value between 1 and 3');
        valid = false;
    }
    if (!formTitle.checkValidity()) {
        showInvalid('please enter a title');
        valid = false;
    }
    return valid;
}

submitBtn.addEventListener('click', () => {
    if (callbackFunctionOnConfirmEditPopup != null) {
        if (checknewTaskFormValid()) {
            callbackFunctionOnConfirmEditPopup(new Task(
                formTitle.value,
                formDescription.value,
                formPriority.value,
                new Date(formDueDate.value),
            ));
            editTaskPopup.style.display = 'none';
        }
    }
});

document.querySelectorAll('[data-close-popup]').forEach((btn) => btn.addEventListener('click', () => {
    showWarningPopUp('Close Window?', 'by answering yes you lost all the changes made in this form!', () => { editTaskPopup.style.display = 'none'; });
}));

function getLocalFromDate(date) {
    const local = date;
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
}

function setUpAsAddNewTaskPopup() {
    windowTitle.textContent = 'Add a new Task';
    submitBtn.textContent = 'Add';
    formTitle.value = '';
    formDueDate.value = getLocalFromDate(new Date());
    formDescription.value = '';
    formPriority.value = 3;
}

function setupAsEditPopup(task) {
    windowTitle.textContent = 'Edit Task';
    submitBtn.textContent = 'Edit';
    formTitle.value = task.title;
    formPriority.value = task.importance;
    formDueDate.value = getLocalFromDate(new Date(task.dueDate));
    formDescription.value = task.description;
}

export default function showEditTaskPopUp(callbackOnYes, task) {
    editTaskPopup.style.display = 'block';
    warningDisplay.style.display = 'none';
    if (task === undefined) {
        setUpAsAddNewTaskPopup();
    } else {
        setupAsEditPopup(task);
    }
    callbackFunctionOnConfirmEditPopup = callbackOnYes;
}