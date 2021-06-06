import showEditTaskPopUp from './edit-popup.js';
import Util from '../utils.js';
import showWarningPopUp from './warning-popup.js';

const listParent = document.querySelector('[data-task-list]');
const cardDetailsCompiled = Handlebars.compile(document.getElementById('card-details-template').innerHTML);
const cardFooterTodo = Handlebars.compile(document.getElementById('task-btn-holder-todo-template').innerHTML);
const cardFooterDone = Handlebars.compile(document.getElementById('task-btn-holder-done-template').innerHTML);
const sortListCategory = Handlebars.compile(document.getElementById('task-sort-list-category-template').innerHTML);

function sortCreatedDate(a, b) {
    return a.createdDate - b.createdDate;
}

function sortFinishedDate(a, b) {
    return a.finishDate - b.finishDate;
}

function sortImportance(a, b) {
    return a.importance - b.importance;
}

function sortDueDate(a, b) {
    return a.dueDate - b.dueDate;
}

function getFinishedDateAsHtml(task) {
    return task.finished ? `${task.finishDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.finishDate.getFullYear()}` : 'not yet';
}

function getCardFooterAsHtml(task, _id) {
    return task.finished ? cardFooterDone({id: _id}) : cardFooterTodo({id: _id});
}

function getPriorityHtml(task) {
    let html = '';
    for (let i = 0; i < task.importance; i++) {
        html += '*';
    }
    return html;
}

export default class View {
    constructor(toDoManager) {
        this.toDoManager = toDoManager;
        this.cardList = [];
        this.displayType = {
            default: 0,
            createdDate: 0,
            sortDueDate: 1,
            sortImportance: 2,
            showFinised: 3};
    }

    updateView(displayType) {
        this.clearList();
        if (displayType) {
            switch (displayType) {
                case this.displayType.default:
                    this.defaultListDisplay();
                    break;
                case this.displayType.sortDueDate:
                    this.dueDateSortDisplay();
                    break;
                case this.displayType.sortImportance:
                    this.importanceSortDisplay();
                    break;
                case this.displayType.showFinised:
                    this.finishedListDisplay();
                    break;
                default:
                    console.error(`displaytpye: ${displayType} does not exist`);
                    break;
            }
        } else {
            this.defaultListDisplay();
        }
    }

    defaultListDisplay() {
        this.toDoManager.getTasks()
            .sort((a, b) => sortCreatedDate(a, b))
            .forEach((task) => this.createTaskCard(task));
        listParent.innerHTML += sortListCategory({id: 1});
        const sortCategory = document.getElementById('sort-cat-1');
        document.getElementById('sort-cat-title-1').innerText = 'late Tasks:';
        this.cardList.forEach((card) => sortCategory.appendChild(card));
    }

    finishedListDisplay() {
        this.toDoManager.getFinishedTask()
        .sort((a, b) => sortCreatedDate(a, b))
        .forEach((task) => this.createTaskCard(task));
        this.cardList.forEach((card) => listParent.appendChild(card));
    }

    dueDateSortDisplay() {
        this.toDoManager.getTasks()
            .sort((a, b) => sortDueDate(a, b))
            .forEach((task) => this.createTaskCard(task));
        this.cardList.forEach((card) => listParent.appendChild(card));
    }

    importanceSortDisplay() {
        this.toDoManager.getTasks()
            .sort((a, b) => sortImportance(a, b))
            .forEach((task, id) => this.createTaskCard(task, id));
        this.cardList.forEach((card) => listParent.appendChild(card));
    }

    clearList() {
        listParent.innerHTML = '';
        this.cardList = [];
    }

    createTaskCard(task) {
        const newCard = document.createElement('div');
        const id = Util.getKeyByValueFromObject(task, this.toDoManager.getTaskListAsArray());
        newCard.classList.add('task-card');
        newCard.id = id;
        const html = cardDetailsCompiled(
            {title: task.title,
            priority: getPriorityHtml(task),
            dueDateString: `${task.dueDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.dueDate.getFullYear()}`,
            createDateString: `${task.createDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.createDate.getFullYear()}`,
            finshedDateString: `${getFinishedDateAsHtml(task)}`,
            description: task.description},
            );
        newCard.innerHTML = html + getCardFooterAsHtml(task, id);
        this.addEventlisteners(newCard, task, id, this.toDoManager, this);
        this.cardList.push(newCard);
    }

    addEventlisteners(newCard, task, id, toDoManager, view) {
        if (!task.finished) {
            newCard.addEventListener('click', (event) => {
                if (event.target.name !== 'done' && event.target.name !== 'cancel') {
                    showEditTaskPopUp(
                        (updatedTask) => {
                            this.toDoManager.updateTask(id, updatedTask);
                            this.updateView(this.displayType.sortDueDate);
                        },
                        task,
                    );
                }
            });
            newCard.querySelector('[data-done-btn]').addEventListener('click', () => showWarningPopUp('Finish Task?', 'By answering yes the task will get moved into the "finished Task" list', () => {
                toDoManager.finishTaskById(id);
                view.updateView();
            }));

            newCard.addEventListener('mouseover', () => {
                const msgBox = newCard.querySelector('[data-card-msg]');
                msgBox.style.display = 'block';
                msgBox.innerHTML = 'click to edit';
                setTimeout(() => { msgBox.style.display = 'none'; }, 1000);
            });

            newCard.addEventListener('mouseleave', (event) => {
                const msgBox = newCard.querySelector('[data-card-msg]');
                if (!event.bubbles) msgBox.style.display = 'none';
            });
        }

        newCard.querySelector('[data-cancel-btn]').addEventListener('click', () => showWarningPopUp('Deleting Task?', 'By answering yes the task will get deleted permanently!', () => {
            this.toDoManager.removefromTaskList(id);
            this.updateView();
        }));
    }
}
