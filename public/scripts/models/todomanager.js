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
}
