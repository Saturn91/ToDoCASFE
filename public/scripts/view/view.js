import showEditTaskPopUp from './edit-popup.js';
import Util from '../utils.js';
import showWarningPopUp from './warning-popup.js';

const listParent = document.querySelector('[data-task-list]');

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
    return task.finished ? `<p class='property'>${task.finishDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.finishDate.getFullYear()}</p>` : '<p class="property">not yet</p>';
}

function getCardFooterAsHtml(task, id) {
    if (!task.finished) {
        return `        
        <div class="button-holder">
            <button name="done" class="btn positive" id="${id}" data-done-btn>Done</button>
            <button name="cancel" class="btn negative" id="${id}" data-cancel-btn>Cancel</button>
        </div>        
        `;
    }
    return `
    <div class="button-holder">
        <button name="cancel" class="btn negative" id="${id}" data-cancel-btn>Delete</button>
    </div>`;
}

function getPriorityHtml(task) {
    let html = '<p class="property">';
    for (let i = 0; i < task.importance; i++) {
        html += '*';
    }
    html += '</p>';
    return html;
}

export default class View {
    constructor(toDoManager) {
        this.toDoManager = toDoManager;
        this.addNewCardItem = listParent.querySelector('.first');
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
        listParent.appendChild(this.addNewCardItem);
        this.cardList.forEach((card) => listParent.appendChild(card));
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
        listParent.appendChild(this.addNewCardItem);
        this.cardList.forEach((card) => listParent.appendChild(card));
    }

    importanceSortDisplay() {
        this.toDoManager.getTasks()
            .sort((a, b) => sortImportance(a, b))
            .forEach((task, id) => this.createTaskCard(task, id));
        listParent.appendChild(this.addNewCardItem);
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
        const html = `
        <h1>${task.title}</h1>
        <div class="display-property">
          <p class='label'>priority:</p>
          <p class='property'>${getPriorityHtml(task)}</p>
        </div>
        <div class="display-property">
          <p class='label'>due:</p>
          <p class='property'>${task.dueDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.dueDate.getFullYear()}</p>
        </div>
        <div class="display-property">
          <p class='label'>created:</p>
          <p class='property'>${task.createDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.createDate.getFullYear()}</p>
        </div>
        <div class="display-property line-bottem">
          <p class='label'>finished:</p>
          ${getFinishedDateAsHtml(task)}
        </div>
        <p class="description">${task.description}</p>
        <p class="msg-line" data-card-msg>nothing to show</p>
        ${getCardFooterAsHtml(task, id)}`;

        newCard.innerHTML = html;
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