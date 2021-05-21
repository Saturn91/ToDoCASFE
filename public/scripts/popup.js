/* Popup show/hide */
import Task from './models/task.js';

export default class Popup {
    constructor(view, toDoManager) {
        this.view = view;
        this.toDoManager = toDoManager;
        this.closeBtns = document.querySelectorAll('[data-close-popup]');
        this.popUpWindow = document.querySelector('[data-popup]');
        this.addTaskBtn = document.querySelectorAll('[data-add-task]');
        this.newTaskSubmitBtn = document.querySelector('[data-submit-task]');
        this.warningDisplay = document.querySelector('[data-form-msg]');
        this.formTitle = this.popUpWindow.querySelector('input[name="title"]');
        this.formDescription = this.popUpWindow.querySelector('textarea[name="description"]');
        this.formPriority = this.popUpWindow.querySelector('input[name="prio"]');
        this.formDueDate = this.popUpWindow.querySelector('input[name="duedate"]');

        this.addTaskBtn.forEach((button) => {
            button.addEventListener('click', () => {
                this.show(true);
            });
        });

        this.closeBtns.forEach((item) => {
            item.addEventListener('click', () => {
                this.show(false);
            });
        });

        this.newTaskSubmitBtn.addEventListener('click', () => {
            if (this.checknewTaskFormValid()) {
                 this.toDoManager.addTask(
                     new Task(
                         this.formTitle.value,
                         this.formDescription.value,
                         this.formPriority.value,
                         new Date(this.formDueDate.value),
                         ),
         );
                 this.view.updateView(this.view.displayType.createdDate);
                 this.show(false);
            }
         });
    }

    show(show) {
        if (show) {
            this.popUpWindow.style.display = 'block';
            this.warningDisplay.style.display = 'none';
            /* Set Date to default 'today' */
            const local = new Date();
            local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
            this.formDueDate.value = local.toJSON().slice(0, 10);
            this.formTitle.value = '';
            this.formDescription.value = '';
            this.formPriority.value = 3;
        } else {
            this.popUpWindow.style.display = 'none';
        }
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
