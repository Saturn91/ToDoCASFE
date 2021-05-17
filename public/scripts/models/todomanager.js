function addTaskToList(task) {
    const taskList = document.querySelector('[data-task-list]');
    const newCard = document.createElement('div');
    newCard.classList.add('task-card');
    newCard.innerHTML = task.getHtmlText();
    taskList.appendChild(newCard);
}

export default class ToDoManager {
    constructor() {
        this.taskList = [];
    }

    addTask(task) {
        this.taskList.push(task);
    }

    toString() {
        let output = '';
        for (let i = 0; i < this.taskList.length; i++) {
            output += ` ${this.taskList[i].toString()}`;
        }
        return output;
    }

    displayList() {
        this.taskList.forEach((task) => addTaskToList(task));
    }
}
