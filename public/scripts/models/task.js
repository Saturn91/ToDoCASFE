export default class Task {
    constructor(title, description, importance, dueDate, createDate, finishDate, finished, id) {
        this.title = title;
        this.description = description;
        this.finishDate = finishDate === undefined ? new Date() : new Date(finishDate);
        this.dueDate = new Date(dueDate);
        this.createDate = createDate === undefined ? new Date() : new Date(createDate);
        this.importance = importance;
        this.finished = finished === undefined ? false : finished;
        this.deleted = false;
        this.id = id;
    }

    debug() {
        return `[${this.importance}][${this.title}]: "${this.description}", start: ${this.createDate} - ${this.finishDate} finished: ${this.finished} deleted: ${this.deleted}`;
    }
}
