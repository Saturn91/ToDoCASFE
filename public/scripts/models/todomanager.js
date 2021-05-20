export default class ToDoManager {
    constructor() {
        this.taskList = [];
        this.removedTasks = [];
        this.finishedTasks = [];
    }

    addTask(task) {
        this.taskList.push(task);
    }

    readTaskByID(id) {
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

    removeTaskById(id) {
       this.taskList.forEach((task, index) => {
            if (task.id === id) {
                this.removedTasks.push(this.taskList.splice(index, 1)[0]);
            }
       });
    }

    finishTaskById(id) {
        const newTask = this.readTaskByID(id);
        newTask.finished = true;
        newTask.finished = new Date();
        this.updateTask(id, newTask);
        this.taskList.forEach((task, index) => {
            if (task.id === id) {
                this.finishedTasks.push(this.taskList.splice(index, 1)[0]);
            }
       });
    }

    updateTask(id, task) {
        this.taskList.forEach((element, index) => {
            if (element.id === id) {
                this.taskList[index] = task;
            }
        });
    }
}
