import Task from './task.js';

function generateSaveProperty(saveIndex, property, value) {
    localStorage.setItem(`task_${saveIndex}_${property}`, value);
}

function getSaveProperty(saveIndex, property) {
    return localStorage.getItem(`task_${saveIndex}_${property}`);
}

function generateSaveProperties(saveIndex, task) {
    generateSaveProperty(saveIndex, 'title', task.title);
    generateSaveProperty(saveIndex, 'description', task.description);
    generateSaveProperty(saveIndex, 'finishDate', task.finishDate);
    generateSaveProperty(saveIndex, 'dueDate', task.dueDate);
    generateSaveProperty(saveIndex, 'createDate', task.createDate);
    generateSaveProperty(saveIndex, 'importance', task.importance);
    generateSaveProperty(saveIndex, 'finished', task.finished ? 1 : 0);
}

function getTaskFromSaveIndex(saveIndex) {
    return new Task(
        getSaveProperty(saveIndex, 'title'),
        getSaveProperty(saveIndex, 'description'),
        getSaveProperty(saveIndex, 'importance'),
        new Date(getSaveProperty(saveIndex, 'dueDate')),
        new Date(getSaveProperty(saveIndex, 'createDate')),
        new Date(getSaveProperty(saveIndex, 'finishDate')),
        Number(getSaveProperty(saveIndex, 'finished')) === 1,
    );
}

export default class ToDoManager {
    constructor() {
        this.taskList = [];
        this.finishedTasks = [];
        this.loadedItems = [];
        const loadedItems = localStorage.getItem('TaskNumber');
        if (loadedItems != null) {
            for (let i = 0; i < loadedItems; i++) this.loadedItems.push(getTaskFromSaveIndex(i));
        }
        this.taskList = this.loadedItems.filter((task) => !task.finished);
        this.finishedTasks = this.loadedItems.filter((task) => task.finished);
    }

    addTask(task) {
        this.taskList.push(task);
        this.saveToLocalStorage();
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
            delete this.taskList[id];
            this.saveToLocalStorage();
            return;
        }
        console.error(`unexpected id: ${id} is not contained in this.tasklist!`);
    }

    removeTaskFromFinishedList(id) {
        if (this.finishedTasks[id] !== undefined && this.finishedTasks[id] !== null) {
            delete this.finishedTasks[id];
            this.saveToLocalStorage();
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
        this.saveToLocalStorage();
    }

    updateTask(id, task) {
        this.taskList[id] = task;
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorage.clear();
        this.taskList.forEach((task, index) => generateSaveProperties(index, task));
        this.finishedTasks
            .forEach((task, index) => generateSaveProperties(this.taskList.length + index, task));
        localStorage.setItem('TaskNumber', this.taskList.length + this.finishedTasks.length);
    }
}
