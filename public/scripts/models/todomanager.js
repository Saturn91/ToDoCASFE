import { getTaskFromSaveIndex, saveToLocalStorage } from './StorageManager.js';

export default class ToDoManager {
    constructor() {
        this.taskList = [];
        this.finishedTasks = [];
        this.loadedItems = [];
        const loadedItems = localStorage.getItem('TaskNumber');
        if (loadedItems != null) {
            for (let i = 0; i < loadedItems; i++) {
                this.loadedItems.push(getTaskFromSaveIndex(i));
            }
        }
        this.taskList = this.loadedItems.filter((task) => !task.finished);
        this.finishedTasks = this.loadedItems.filter((task) => task.finished);
    }

    addTask(task) {
        this.taskList.push(task);
        saveToLocalStorage(this);
    }

    readTaskByID(id) {
        return this.taskList[id] || null;
    }

    toString() {
        let output = '';
        this.taskList.forEach((task) => { output += ` ${task.debug()}`; });
        return output;
    }

    removefromTaskList(id) {
        if (this.taskList[id] !== undefined && this.taskList[id] !== null) {
            this.taskList.splice(id, 1);
            saveToLocalStorage(this);
            return;
        }
        console.error(`unexpected id: ${id} is not contained in this.tasklist!`);
    }

    removeTaskFromFinishedList(id) {
        if (this.finishedTasks[id] !== undefined && this.finishedTasks[id] !== null) {
            this.finishedTasks.splice(id, 1);
            saveToLocalStorage(this);
            return;
        }
        console.error(`unexpected id: ${id} is not contained in this.finishedTasks!`);
    }

    finishTaskById(id) {
        const newTask = this.readTaskByID(id);
        newTask.finished = true;
        newTask.finishDate = new Date();
        this.updateTask(id, newTask);
        this.finishedTasks.push(this.taskList.splice(id, 1)[0]);
        saveToLocalStorage(this);
    }

    updateTask(id, task) {
        this.taskList[id] = task;
        saveToLocalStorage(this);
    }
}
