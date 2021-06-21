import nedb from './data/task-storage-manager.js';
import Task from './task.js';

export default class ToDoManager {
    loadTasks(callback) {
        nedb.getAll((text) => {
            const dataList = JSON.parse(text);
            this.taskList = {};
            dataList.forEach((entry) => {
                if (entry.state !== 'DELETED') {
                    // eslint-disable-next-line no-underscore-dangle
                this.taskList[entry._id] = new Task(
                    entry.title, entry.description, entry.importance, entry.dueDate,
                    // eslint-disable-next-line no-underscore-dangle
                    entry.createDate, entry.finishDate, entry.finished, entry._id,
                    );
                }
            });
            if (callback) {
                callback();
            }
        });
    }

    addTask(task, callback) {
        nedb.saveToNedb(task, this.loadTasks(callback));
    }

    readTaskByID(id) {
        return this.taskList[id] || null;
    }

    toString() {
        let output = '';
        this.getTaskListAsArray().forEach((task) => { output += ` ${task.debug()}`; });
        return output;
    }

    removefromTaskList(id, callback) {
        if (this.readTaskByID(id) != null) {
            nedb.delete(id, callback);
        }
    }

    finishTaskById(id) {
        if (this.taskList[id] !== undefined) {
            this.taskList[id].finished = true;
            this.taskList[id].finishDate = new Date();
            this.updateTask(id, this.taskList[id]);
        }
    }

    updateTask(id, task) {
        const tempTask = task;
        tempTask.createDate = this.taskList[id].createDate;
        this.taskList[id] = task;
        nedb.update(id, task);
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
