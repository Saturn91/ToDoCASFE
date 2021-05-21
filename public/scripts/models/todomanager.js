import Task from './task.js';

function generateSaveProperty(saveIndex, property, value) {
    localStorage.setItem(`task_${saveIndex}_${property}`, value);
}

function getSaveProperty(saveIndex, property) {
    return localStorage.getItem(`task_${saveIndex}_${property}`);
}

function generateSaveProperties(saveIndex, task) {
    generateSaveProperty(saveIndex, 'id', task.id);
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
        getSaveProperty(saveIndex, 'id'),
    );
}

export default class ToDoManager {
    constructor() {
        this.taskList = [];
        this.removedTasks = [];
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
        newTask.finishDate = new Date();
        this.updateTask(id, newTask);
        this.taskList.forEach((task, index) => {
            if (task.id === id) {
                this.finishedTasks.push(this.taskList.splice(index, 1)[0]);
            }
       });
       this.saveToLocalStorage();
    }

    updateTask(id, task) {
        this.taskList.forEach((element, index) => {
            if (element.id === id) {
                this.taskList[index] = task;
                this.taskList[index].id = id;
            }
        });
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
