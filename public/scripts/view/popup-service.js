/* Popup show/hide */
import Task from '../models/task.js';
import getKeyByValueFromObject from '../utils.js';

function getLocalFromDate(date) {
    const local = date;
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
}

function submitTaskEdit(popup) {
    if (popup.checknewTaskFormValid()) {
            popup.toDoManager.updateTask(
                getKeyByValueFromObject(popup.taskMemory, popup.toDoManager.taskList),
                new Task(
                    popup.formTitle.value,
                    popup.formDescription.value,
                    popup.formPriority.value,
                    new Date(popup.formDueDate.value),
                ),
            );
        return true;
    }
    return false;
}

function submitNewTask(popup) {
    if (popup.checknewTaskFormValid()) {
        popup.toDoManager.addTask(
            new Task(
                popup.formTitle.value,
                popup.formDescription.value,
                popup.formPriority.value,
                new Date(popup.formDueDate.value),
                ),
        );
        return true;
    }
    return false;
}

export default class PopupService {
    constructor(view, toDoManager) {
        this.view = view;
        this.toDoManager = toDoManager;
        this.popUpWindow = document.querySelector('[data-edit-popup]');
        PopupService.doOnSubmitFunction = submitNewTask;
        if (PopupService.newTaskSubmitBtn === undefined) {
            PopupService.newTaskSubmitBtn = document.querySelector('[data-submit-task]');
            PopupService.newTaskSubmitBtn.addEventListener('click', () => handleSubmitForm(this));
        }
        this.formTitle = this.popUpWindow.querySelector('input[name="title"]');
        this.formDescription = this.popUpWindow.querySelector('textarea[name="description"]');
        this.formPriority = this.popUpWindow.querySelector('input[name="prio"]');
        this.formDueDate = this.popUpWindow.querySelector('input[name="duedate"]');
        this.warningDisplay = document.querySelector('[data-form-msg]');
        this.windowTitle = document.querySelector('[data-form-title]');
    }

    show(show, task) {
        if (show) {
            this.popUpWindow.style.display = 'block';
            this.warningDisplay.style.display = 'none';

            if (task !== undefined) {
                this.windowTitle.textContent = 'View Task';
                PopupService.newTaskSubmitBtn.textContent = 'Update';
                this.editTask(task);
            } else {
                this.windowTitle.textContent = 'Add new Task';
                PopupService.newTaskSubmitBtn.textContent = 'Add';
                this.addNewTask();
            }
        } else {
            this.popUpWindow.style.display = 'none';
        }
    }

    addNewTask() {
        this.formTitle.value = '';
        this.formDueDate.value = getLocalFromDate(new Date());
        this.formDescription.value = '';
        this.formPriority.value = 3;
        PopupService.doOnSubmitFunction = submitNewTask;
    }

    editTask(task) {
        this.formTitle.value = task.title;
        this.formPriority.value = task.importance;
        this.formDueDate.value = getLocalFromDate(new Date(task.dueDate));
        this.formDescription.value = task.description;
        this.taskMemory = task;
        PopupService.doOnSubmitFunction = submitTaskEdit;
    }

    showInvalid(msg) {
        this.warningDisplay.style.display = 'block';
        this.warningDisplay.textContent = msg;
    }

    checknewTaskFormValid() {
        let valid = true;
        if (!this.formDescription.checkValidity()) {
            this.showInvalid('please enter a description');
            valid = false;
        }
        if (!this.formPriority.checkValidity()) {
            this.showInvalid('priority has to be a value between 1 and 3');
            valid = false;
        }
        if (!this.formTitle.checkValidity()) {
            this.showInvalid('please enter a title');
            valid = false;
        }
        return valid;
    }
}

function handleSubmitForm(popup) {
    if (PopupService.doOnSubmitFunction(popup)) {
        popup.view.updateView(popup.view.displayType.createdDate);
        popup.show(false);
    }
}
