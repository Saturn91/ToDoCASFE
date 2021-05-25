import { getTaskFromSaveIndex, saveToLocalStorage } from './StorageManager.js';

export default class ToDoManager {
    constructor() {
        this.taskList = {};
        this.taskNum = 0;
        const loadedItems = localStorage.getItem('TaskNumber');
        if (loadedItems != null) {
            for (let i = 0; i < loadedItems; i++) {
                this.taskList[this.taskNum] = getTaskFromSaveIndex(i);
                this.taskNum += 1;
            }
        }
    }

    addTask(task) {
        this.taskList[this.taskNum] = task;
        this.taskNum += 1;
        saveToLocalStorage(this);
    }

    readTaskByID(id) {
        return this.taskList[id] || null;
    }

    toString() {
        let output = '';
        this.getTaskListAsArray().forEach((task) => { output += ` ${task.debug()}`; });
        return output;
    }

    removefromTaskList(id) {
        if (this.readTaskByID(id) != null) {
            this.taskList[id].deleted = true;
            saveToLocalStorage(this);
            return;
        }
        console.error(`unexpected id: ${id} is not contained in this.tasklist!`);
    }

    finishTaskById(id) {
        if (this.taskList[id] !== undefined) {
            this.taskList[id].finished = true;
            this.taskList[id].finishDate = new Date();
            saveToLocalStorage(this);
            return;
        }
        console.error(`id: ${id} does not exist in taskList`);
    }

    updateTask(id, task) {
        this.taskList[id] = task;
        saveToLocalStorage(this);
    }

    getTaskListAsArray() {
        return Object.values(this.taskList);
    }

    getFinishedTask() {
        return this.getTaskListAsArray().filter((task) => task.finished && !task.deleted);
    }

    getTasks() {
        return this.getTaskListAsArray().filter((task) => !task.deleted && !task.finished);
    }
}
