export default class Task {
    constructor(title, description, importance, dueDate, createDate, finishDate, finished) {
        this.title = title;
        this.description = description;
        this.finishDate = finishDate === undefined ? new Date() : finishDate;
        this.dueDate = dueDate;
        this.createDate = finishDate === undefined ? new Date() : createDate;
        this.importance = importance;
        this.finished = finished === undefined ? false : finished;
    }

    debug() {
        return `[${this.importance}][${this.title}]: "${this.description}", start: ${this.createDate} - ${this.finishDate} finished: ${this.finished}`;
    }
}
