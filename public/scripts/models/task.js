export default class Task {
    constructor(title, description, importance, dueDate, createDate, finishDate, finished, id) {
        if (id === undefined) {
          if (Task.idCounter >= 0) {
            Task.idCounter += 1;
          } else {
            Task.idCounter = 0;
          }
          this.id = Task.idCounter;
        } else if (id > Task.idCounter) {
            Task.idCounter = id;
            this.id = id;
        }
        this.title = title;
        this.description = description;
        this.finishDate = finishDate === undefined ? new Date() : finishDate;
        this.dueDate = dueDate;
        this.createDate = finishDate === undefined ? new Date() : createDate;
        this.importance = importance;
        this.finished = finished === undefined ? false : finished;

        console.log(this.finished);
    }

    debug() {
        return `ID:[${this.id}][${this.importance}][${this.title}]: "${this.description}", start: ${this.createDate} - ${this.finishDate} finished: ${this.finished}`;
    }
}
