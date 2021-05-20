export default class Task {
    constructor(title, description, importance, dueDate) {
        if (Task.idCounter >= 0) {
          Task.idCounter += 1;
        } else {
          Task.idCounter = 0;
        }
        this.id = Task.idCounter;
        this.title = title;
        this.description = description;
        this.finishDate = new Date();
        this.dueDate = dueDate;
        this.createDate = new Date();
        this.importance = importance;
        this.finised = false;
    }

    toString() {
        return `ID:[${this.id}][${this.importance}][${this.title}]: "${this.description}", start: ${this.createDate} - ${this.finishDate} finished: ${this.finished}`;
    }
}
