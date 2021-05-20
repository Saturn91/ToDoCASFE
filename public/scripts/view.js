const listParent = document.querySelector('[data-task-list]');

export default class View {
    constructor(toDoManager) {
        this.toDoManager = toDoManager;
        this.addNewCardItem = listParent.querySelector('.first');
        this.cardList = [];
        this.displayType = {
            default: 0,
            sortDueDate: 1,
            showFinised: 2};
    }

    updateView(displayType) {
        this.clearList();
        if (displayType) {
            switch (displayType) {
                case this.displayType.default:
                    this.defaultListDisplay();
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
        this.toDoManager.taskList.forEach((task) => this.createTaskCard(task));
        this.cardList.forEach((card) => listParent.appendChild(card));
    }

    clearList() {
        listParent.innerHTML = '';
        this.cardList = [];
        listParent.appendChild(this.addNewCardItem);
    }

    createTaskCard(task) {
        const newCard = document.createElement('div');
        newCard.classList.add('task-card');
        newCard.id = task.id;
        let html = `
        <h1>${task.title}</h1>
        <div class="display-date">
          <p class='label'>due:</p>
          <p class='date'>${task.dueDate.getDay()}/${task.dueDate.getMonth()}/${task.dueDate.getFullYear()}</p>
        </div>
        <div class="display-date line-bottem">
          <p class='label'>finished:</p>`;

        if (task.finished) {
          html += `<p class='date'>${task.finishDate.getDay()}/${task.finishDate.getMonth()}/${task.finishDate.getFullYear()}</p>`;
        } else {
          html += '<p class="date">not yet</p>';
        }

        html += `        </div>
        <p class="description">${task.description}</p>
        <div class="button-holder">
          <button class="btn positive" id="${task.id}" data-done-btn>Done</button>
          <button class="btn negative" id="${task.id}" data-cancel-btn>Cancel</button>
        </div>        
        `;
        newCard.innerHTML = html;
        newCard.querySelector('[data-done-btn]').addEventListener('click', () => {
            this.toDoManager.getTaskByID(task.id).setDone();
            this.updateView();
        });
        newCard.querySelector('[data-cancel-btn]').addEventListener('click', () => {
            this.toDoManager.removeTaskById(task.id);
            this.updateView();
        });
        this.cardList.push(newCard);
    }
}
