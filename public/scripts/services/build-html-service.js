import showEditTaskPopUp from '../view/popups/edit-popup.js';

/* eslint-disable no-undef */
const cardDetailsCompiled = Handlebars.compile(document.getElementById('card-details-template').innerHTML);
const cardFooterTodo = Handlebars.compile(document.getElementById('task-btn-holder-todo-template').innerHTML);
const cardFooterDone = Handlebars.compile(document.getElementById('task-btn-holder-done-template').innerHTML);
const sortListCategory = Handlebars.compile(document.getElementById('task-sort-list-category-template').innerHTML);

const listParent = document.querySelector('[data-task-list]');

export default {
    getFinishedDateAsHtml(task) {
        return task.finished ? `${task.finishDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.finishDate.getFullYear()}` : 'not yet';
    },
    getCardFooterAsHtml(task) {
        return task.finished ? cardFooterDone({id: task.id}) : cardFooterTodo({id: task.id});
    },
    getPriorityHtml(task) {
        let html = '';
        for (let i = 0; i < task.importance; i++) {
            html += '*';
        }
        return html;
    },
    updateAddTaskBtns(view, toDoManager) {
        const addTaskBtn = document.querySelectorAll('[data-add-task]');
        addTaskBtn.forEach((button) => button.addEventListener('click', () => showEditTaskPopUp((newTask) => {
            toDoManager.addTask(newTask);
            view.updateView();
        })));
    },
    createTaskCard(task) {
        const newCard = document.createElement('div');
        newCard.classList.add('task-card');
        // eslint-disable-next-line no-underscore-dangle
        newCard.id = task.id;
        const html = cardDetailsCompiled(
            {title: task.title,
            priority: this.getPriorityHtml(task),
            dueDateString: `${task.dueDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.dueDate.getFullYear()}`,
            createDateString: `${task.createDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.createDate.getFullYear()}`,
            finshedDateString: `${this.getFinishedDateAsHtml(task)}`,
            description: task.description},
            );
        newCard.innerHTML = html + this.getCardFooterAsHtml(task);
        return newCard;
    },
    addNewSortCategory(sortCatTitle, tasks) {
        if (tasks.length > 0) {
            listParent.innerHTML += sortListCategory({id: sortCatTitle});
            const sortCategory = document.getElementById(`sort-cat-${sortCatTitle}`);
            document.getElementById(`sort-cat-title-${sortCatTitle}`).innerText = sortCatTitle;
            tasks.forEach((task) => sortCategory.appendChild(this.createTaskCard(task)));
        }
    },
    clearList() {
        listParent.innerHTML = '';
    },
};
