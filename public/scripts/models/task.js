export default class Task {
    constructor(title, description, importance, dueDate) {
        this.title = title;
        this.description = description;
        this.finishDate = new Date();
        this.dueDate = dueDate;
        this.createDate = new Date();
        this.importance = importance;
        this.finised = false;
    }

    toString() {
        return `[${this.importance}][${this.title}]: "${this.description}", start: ${this.createDate} - ${this.finishDate} finished: ${this.finished}`;
    }

    getHtmlText() {
        return `
        <h1>${this.title}</h1>
        <div class="display-date">
          <p class='label'>due:</p>
          <p class='date'>${this.dueDate.getDay()}/${this.dueDate.getMonth()}/${this.dueDate.getFullYear()}</p>
        </div>
        <div class="display-date line-bottem">
          <p class='label'>finished:</p>
          <p class='date'>${this.finishDate.getDay()}/${this.finishDate.getMonth()}/${this.finishDate.getFullYear()}</p>
        </div>
        <p class="description">${this.description}</p>
        <div class="button-holder">
          <button class="btn positive">Done</button>
          <button class="btn negative">Cancel</button>
        </div>        
        `;
    }
}
