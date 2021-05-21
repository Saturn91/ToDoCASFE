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
    return b.dueDate - a.dueDate;
}

function getFinishedDateAsHtml(task) {
    console.log();
    return task.finished ? `<p class='property'>${task.finishDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.finishDate.getFullYear()}</p>` : '<p class="property">not yet</p>';
}

function getCardFooterAsHtml(task) {
    if (!task.finished) {
        return `        
        <div class="button-holder">
            <button class="btn positive" id="${task.id}" data-done-btn>Done</button>
            <button class="btn negative" id="${task.id}" data-cancel-btn>Cancel</button>
        </div>        
        `;
    }
    return `
    <div class="button-holder">
        <button class="btn negative" id="${task.id}" data-cancel-btn>Delete</button>
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
        this.toDoManager.taskList
            .sort((a, b) => sortCreatedDate(a, b))
            .forEach((task) => this.createTaskCard(task));
        listParent.appendChild(this.addNewCardItem);
        this.cardList.forEach((card) => listParent.appendChild(card));
    }

    finishedListDisplay() {
        this.toDoManager.finishedTasks
        .sort((a, b) => sortCreatedDate(a, b))
        .forEach((task) => this.createTaskCard(task));
        this.cardList.forEach((card) => listParent.appendChild(card));
    }

    dueDateSortDisplay() {
        this.toDoManager.taskList
            .sort((a, b) => sortDueDate(a, b))
            .forEach((task) => this.createTaskCard(task));
        listParent.appendChild(this.addNewCardItem);
        this.cardList.forEach((card) => listParent.appendChild(card));
    }

    importanceSortDisplay() {
        this.toDoManager.taskList
            .sort((a, b) => sortImportance(a, b))
            .forEach((task) => this.createTaskCard(task));
        listParent.appendChild(this.addNewCardItem);
        this.cardList.forEach((card) => listParent.appendChild(card));
    }

    clearList() {
        listParent.innerHTML = '';
        this.cardList = [];
    }

    createTaskCard(task) {
        const newCard = document.createElement('div');
        newCard.classList.add('task-card');
        newCard.id = task.id;
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
        ${getCardFooterAsHtml(task)}`;

        newCard.innerHTML = html;

        if (!task.finished) {
            newCard.innerHTML = html;
            newCard.querySelector('[data-done-btn]').addEventListener('click', () => {
                this.toDoManager.finishTaskById(task.id);
                this.updateView();
            });
        }

        newCard.querySelector('[data-cancel-btn]').addEventListener('click', () => {
            this.toDoManager.removeTaskById(task.id);
            this.updateView();
        });

        this.cardList.push(newCard);
    }
}
