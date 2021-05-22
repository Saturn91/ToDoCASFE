export default class Task {
    constructor(title, description, importance, dueDate, createDate, finishDate, finished) {
        if (Task.idCounter >= 0) {
          Task.idCounter += 1;
        } else {
          Task.idCounter = 0;
        }
        this.id = Task.idCounter;
        this.title = title;
        this.description = description;
        this.finishDate = finishDate === undefined ? new Date() : finishDate;
        this.dueDate = dueDate;
        this.createDate = finishDate === undefined ? new Date() : createDate;
        this.importance = importance;
        this.finished = finished === undefined ? false : finished;
    }

    debug() {
        return `ID:[${this.id}][${this.importance}][${this.title}]: "${this.description}", start: ${this.createDate} - ${this.finishDate} finished: ${this.finished}`;
    }
}
