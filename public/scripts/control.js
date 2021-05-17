import Task from './models/task.js';
import ToDoManager from './models/todomanager.js';

const closeBtns = document.querySelectorAll('[data-close-popup]');
const popUpWindow = document.querySelector('[data-popup]');
const addTaskBtn = document.querySelector('[data-add-task]');
const newTaskSubmitBtn = document.querySelector('[data-submit-task]');
const warningDisplay = document.querySelector('[data-form-msg]');
const toDoManager = new ToDoManager();
const formTitle = popUpWindow.querySelector('input[name="title"]');
const formDescription = popUpWindow.querySelector('textarea[name="description"]');
const formPriority = popUpWindow.querySelector('input[name="prio"]');
const formDueDate = popUpWindow.querySelector('input[name="duedate"]');

/* Popup show/hide */

function showPopup(show) {
    if (show) {
        popUpWindow.style.display = 'block';
        warningDisplay.style.display = 'none';
        /* Set Date to default 'today' */
        const local = new Date();
        local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
        formDueDate.value = local.toJSON().slice(0, 10);
        formTitle.value = '';
        formDescription.value = '';
        formPriority.value = 3;
    } else {
        popUpWindow.style.display = 'none';
    }
}

showPopup(false);

addTaskBtn.addEventListener('click', () => {
    showPopup(true);
});

closeBtns.forEach((item) => {
    item.addEventListener('click', () => {
        showPopup(false);
    });
});

/* submit new task */

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

const listParent = document.querySelector('[data-task-list]');

function clearList() {
    const addNewCard = listParent.querySelector('.first');
    listParent.innerHTML = '';
    listParent.appendChild(addNewCard);
}

 function addTaskToList(task) {
    const newCard = document.createElement('div');
    newCard.classList.add('task-card');
    newCard.innerHTML = task.getHtmlText();
    listParent.appendChild(newCard);
}

 function updateList() {
     clearList();
     toDoManager.taskList.forEach((task) => addTaskToList(task));
}

newTaskSubmitBtn.addEventListener('click', () => {
   if (checknewTaskFormValid()) {
        toDoManager.addTask(
            new Task(
                formTitle.value,
                formDescription.value,
                formPriority.value,
                new Date(formDueDate.value),
                ),
);
        updateList();
        showPopup(false);
   }
});
