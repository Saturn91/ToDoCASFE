import nedb from './data/task-storage-manager.js';
import Task from './task.js';

export default class ToDoManager {
    loadTasks(callback) {
        nedb.getAll((text) => {
            const dataList = JSON.parse(text);
            this.taskList = {};
            dataList.forEach((entry) => {
                // eslint-disable-next-line no-underscore-dangle
                this.taskList[entry._id] = new Task(
                    entry.title, entry.description, entry.importance, entry.dueDate,
                    entry.createDate, entry.finishDate, entry.finished,
                    );
            });

            console.log(this.taskList);
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

    removefromTaskList(id) {
        if (this.readTaskByID(id) != null) {
            nedb.delete(id);
            this.loadTasks();
            return;
        }
        console.error(`unexpected id: ${id} is not contained in this.tasklist!`);
    }

    finishTaskById(id) {
        if (this.taskList[id] !== undefined) {
            this.taskList[id].finished = true;
            this.taskList[id].finishDate = new Date();
            //saveToLocalStorage(this);
            return;
        }
        console.error(`id: ${id} does not exist in taskList`);
    }

    updateTask(id, task) {
        this.taskList[id] = task;
        //saveToLocalStorage(this);
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
