/* Popup show/hide */
import Task from '../models/task.js';

function getLocalFromDate(date) {
    const local = date;
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
}

export default class PopupService {
    constructor(view, toDoManager) {
        this.view = view;
        this.toDoManager = toDoManager;
        this.popUpWindow = document.querySelector('[data-edit-popup]');
        this.doOnSubmitFunction = this.submitNewTask;
        if (PopupService.newTaskSubmitBtn === undefined) {
            PopupService.newTaskSubmitBtn = document.querySelector('[data-submit-task]');
            PopupService.newTaskSubmitBtn.addEventListener('click', () => {
                if (this.doOnSubmitFunction(this)) {
                    this.view.updateView(this.view.displayType.createdDate);
                    this.show(false);
                }
            });
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
        this.doOnSubmitFunction = this.submitNewTask;
    }

    submitNewTask(popup) {
        if (this.checknewTaskFormValid()) {
            this.toDoManager.addTask(
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

    editTask(task) {
        this.formTitle.value = task.title;
        this.formPriority.value = task.importance;
        this.formDueDate.value = getLocalFromDate(new Date(task.dueDate));
        this.formDescription.value = task.description;
        this.doOnSubmitFunction = this.submitTaskEdit;
        this.taskMemory = task;
    }

    submitTaskEdit(popup) {
        if (this.checknewTaskFormValid()) {
                this.toDoManager.updateTask(
                    popup.taskMemory.id,
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
