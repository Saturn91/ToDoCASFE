export default class Task {
    constructor(title, description, importance) {
        this.title = title;
        this.description = description;
        this.finishDate = new Date();
        this.createDate = new Date();
        this.importance = importance;
        this.finised = false;
    }

    toString() {
        return `[${this.importance}][${this.title}]: "${this.description}", start: ${this.createDate} - ${this.finishDate} finished: ${this.finished}`;
    }

    getHtmlText(){
        let output =`
            
        `;
    }
}