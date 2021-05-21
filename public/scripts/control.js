import ToDoManager from './models/todomanager.js';
import View from './view.js';
import Popup from './popup.js';

const toDoManager = new ToDoManager();
const view = new View(toDoManager);
const popup = new Popup(view, toDoManager);
popup.show(false);
view.updateView(view.displayType.createdDate);

/* sort and display btns */
const sortByDueDate = document.querySelector('[data-sort-duedate-btn]');
const sortCreateDateBtn = document.querySelector('[data-sort-created-btn]');
const showFinishedBtn = document.querySelector('[data-show-finished-btn]');

sortByDueDate.addEventListener('click', () => view.updateView(view.displayType.sortDueDate));
sortCreateDateBtn.addEventListener('click', () => view.updateView(view.displayType.createdDate));
showFinishedBtn.addEventListener('click', () => view.updateView(view.displayType.showFinised));
