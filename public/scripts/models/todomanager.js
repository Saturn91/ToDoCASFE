export default class ToDoManager {
    constructor() {
        this.taskList = [];
    }

    addTask(task) {
        this.taskList.push(task);
    }

    getTaskByID(id) {
        let output = null;
        this.taskList.forEach((element) => {
            if (element.id === id) {
                output = element;
            }
        });
        if (output === null) console.error(`unexpected Error: id: ${id} was not found in tasklist!`);
        return output;
    }

    toString() {
        let output = '';
        for (let i = 0; i < this.taskList.length; i++) {
            output += ` ${this.taskList[i].toString()}`;
        }
        return output;
    }
}
