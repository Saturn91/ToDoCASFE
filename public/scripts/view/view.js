import showEditTaskPopUp from './edit-popup.js';
import Util from '../utils.js';
import showWarningPopUp from './warning-popup.js';

const listParent = document.querySelector('[data-task-list]');
const cardDetailsCompiled = Handlebars.compile(document.getElementById('card-details-template').innerHTML);
const cardFooterTodo = Handlebars.compile(document.getElementById('task-btn-holder-todo-template').innerHTML);
const cardFooterDone = Handlebars.compile(document.getElementById('task-btn-holder-done-template').innerHTML);
const sortListCategory = Handlebars.compile(document.getElementById('task-sort-list-category-template').innerHTML);

// daysort initializing
const today = new Date();
today.setHours(0, 0, 0, 0);
const tommorow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
const dayAfterTomorrow = new Date(tommorow.getTime() + 24 * 60 * 60 * 1000);
const restOfWeekStart = today.getDay() < 6 ? new Date(dayAfterTomorrow.getTime()) : today;
const endOfThisWeek = new Date(today.getTime() + (7 - today.getDay() + 1) * 24 * 60 * 60 * 1000);
const endOfWeekAfter = new Date(endOfThisWeek.
    getTime() + (7 - today.getDay() + 1) * 24 * 60 * 60 * 1000);

function sortCreatedDate(a, b) {
    return a.createdDate - b.createdDate;
}

function sortFinishedDate(a, b) {
    return a.finishDate - b.finishDate;
}

function sortImportance(a, b) {
    return a.importance - b.importance;
}

function sortDueDate(a, b) {
    return a.dueDate - b.dueDate;
}

function getFinishedDateAsHtml(task) {
    return task.finished ? `${task.finishDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.finishDate.getFullYear()}` : 'not yet';
}

function getCardFooterAsHtml(task, _id) {
    return task.finished ? cardFooterDone({id: _id}) : cardFooterTodo({id: _id});
}

function getPriorityHtml(task) {
    let html = '';
    for (let i = 0; i < task.importance; i++) {
        html += '*';
    }
    return html;
}

function clearList() {
    listParent.innerHTML = '';
}

function updateAddTaskBtns(view, toDoManager) {
    const addTaskBtn = document.querySelectorAll('[data-add-task]');

    addTaskBtn.forEach((button) => button.addEventListener('click', () => showEditTaskPopUp((newTask) => {
        toDoManager.addTask(newTask);
        view.updateView(view.displayType.createdDate);
    })));
}

export default class View {
    constructor(toDoManager) {
        this.toDoManager = toDoManager;
        this.cardList = [];
        this.displayType = {
            default: 0,
            createdDate: 0,
            sortDueDate: 1,
            sortImportance: 2,
            showFinised: 3};
    }

    updateView(displayType) {
        clearList();
        if (displayType) {
            switch (displayType) {
                case this.displayType.default:
                    this.defaultListDisplay();
                    break;
                case this.displayType.sortDueDate:
                    this.dueDateSortDisplay();
                    break;
                case this.displayType.sortImportance:
                    this.importanceSortDisplay();
                    break;
                case this.displayType.showFinised:
                    this.finishedListDisplay();
                    break;
                default:
                    console.error(`displaytpye: ${displayType} does not exist`);
                    break;
            }
        } else {
            this.defaultListDisplay();
        }
    }

    defaultListDisplay() {
        this.toDoManager.getTasks()
            .sort((a, b) => sortCreatedDate(a, b));

        const pastTasks = this.toDoManager.getTasks().filter((task) => task.createDate < today);
        this.addNewSortCategory('created in past:', pastTasks);

        const todaysTasks = this.toDoManager.getTasks()
        .filter((task) => task.createDate.getMonth() === today.getMonth()
            && task.createDate.getDate() === today.getDate()
            && task.createDate.getFullYear() === today.getFullYear());
        this.addNewSortCategory('created today:', todaysTasks);
        this.addCardsEvenListeners(this.toDoManager.getTasks());
    }

    finishedListDisplay() {
        this.toDoManager.getFinishedTask()
        .sort((a, b) => sortCreatedDate(a, b));
        this.addNewSortCategory('finished: ', this.toDoManager.getFinishedTask());
        this.addCardsEvenListeners(this.toDoManager.getFinishedTask());
    }

    dueDateSortDisplay() {
        this.toDoManager.getTasks()
            .sort((a, b) => sortDueDate(a, b));

        const lateTasks = this.toDoManager.getTasks().filter((task) => task.dueDate < today);
        this.addNewSortCategory('late tasks:', lateTasks);

        const todaysTasks = this.toDoManager.getTasks()
        .filter((task) => task.dueDate.getMonth() === today.getMonth()
            && task.dueDate.getDate() === today.getDate()
            && task.dueDate.getFullYear() === today.getFullYear());
        this.addNewSortCategory('today:', todaysTasks);

        const tomorrowsTasks = this.toDoManager.getTasks()
        .filter((task) => task.dueDate.getDate() === tommorow.getDate()
        && task.dueDate.getMonth() === tommorow.getMonth()
        && task.dueDate.getFullYear() === tommorow.getFullYear());
        this.addNewSortCategory('tomorrow:', tomorrowsTasks);

        const thisWeekTasks = this.toDoManager.getTasks()
        .filter((task) => task.dueDate.getTime() >= restOfWeekStart.getTime()
        && task.dueDate.getTime() < endOfThisWeek.getTime());
        this.addNewSortCategory('this week:', thisWeekTasks);

        const nextWeekTasks = this.toDoManager.getTasks()
        .filter((task) => task.dueDate.getTime() >= endOfThisWeek.getTime()
        && task.dueDate.getTime() < endOfWeekAfter.getTime());
        this.addNewSortCategory('next week:', nextWeekTasks);

        const laterTasks = this.toDoManager.getTasks()
        .filter((task) => task.dueDate.getTime() >= endOfWeekAfter.getTime());
        this.addNewSortCategory('later:', laterTasks);
        this.addCardsEvenListeners(this.toDoManager.getTasks());
    }

    importanceSortDisplay() {
        this.toDoManager.getTasks().sort((a, b) => sortImportance(a, b));
            this.addNewSortCategory('High Prio: ', this.toDoManager.getTasks().filter((task) => task.importance === '1'));
            this.addNewSortCategory('Medium Prio: ', this.toDoManager.getTasks().filter((task) => task.importance === '2'));
            this.addNewSortCategory('Low Prio: ', this.toDoManager.getTasks().filter((task) => task.importance === '3'));
        this.addCardsEvenListeners(this.toDoManager.getTasks());
    }

    createTaskCard(task) {
        const newCard = document.createElement('div');
        const id = Util.getKeyByValueFromObject(task, this.toDoManager.getTaskListAsArray());
        newCard.classList.add('task-card');
        newCard.id = id;
        const html = cardDetailsCompiled(
            {title: task.title,
            priority: getPriorityHtml(task),
            dueDateString: `${task.dueDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.dueDate.getFullYear()}`,
            createDateString: `${task.createDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.createDate.getFullYear()}`,
            finshedDateString: `${getFinishedDateAsHtml(task)}`,
            description: task.description},
            );
        newCard.innerHTML = html + getCardFooterAsHtml(task, id);
        return newCard;
    }

    addCardsEvenListeners(tasks) {
        tasks.forEach((task) => this.addEventlisteners(task, this.toDoManager, this));
        updateAddTaskBtns(this, this.toDoManager);
    }

    addEventlisteners(task, toDoManager, view) {
        const id = Util.getKeyByValueFromObject(task, toDoManager.getTaskListAsArray());
        const newCard = document.getElementById(id);
        if (!task.finished) {
            newCard.addEventListener('click', (event) => {
                if (event.target.name !== 'done' && event.target.name !== 'cancel') {
                    showEditTaskPopUp(
                        (updatedTask) => {
                            toDoManager.updateTask(id, updatedTask);
                            this.updateView(this.displayType.sortDueDate);
                        },
                        task,
                    );
                }
            });
            newCard.querySelector('[data-done-btn]').addEventListener('click', () => showWarningPopUp('Finish Task?', 'By answering yes the task will get moved into the "finished Task" list', () => {
                toDoManager.finishTaskById(id);
                view.updateView();
            }));

            newCard.addEventListener('mouseover', () => {
                const msgBox = newCard.querySelector('[data-card-msg]');
                msgBox.style.display = 'block';
                msgBox.innerHTML = 'click to edit';
                setTimeout(() => { msgBox.style.display = 'none'; }, 1000);
            });

            newCard.addEventListener('mouseleave', (event) => {
                const msgBox = newCard.querySelector('[data-card-msg]');
                if (!event.bubbles) msgBox.style.display = 'none';
            });
        }

        newCard.querySelector('[data-cancel-btn]').addEventListener('click', () => showWarningPopUp('Deleting Task?', 'By answering yes the task will get deleted permanently!', () => {
            toDoManager.removefromTaskList(id);
            this.updateView();
        }));
    }

    addNewSortCategory(sortCatTitle, tasks) {
        if (tasks.length > 0) {
            listParent.innerHTML += sortListCategory({id: sortCatTitle});
            const sortCategory = document.getElementById(`sort-cat-${sortCatTitle}`);
            document.getElementById(`sort-cat-title-${sortCatTitle}`).innerText = sortCatTitle;
            tasks.forEach((task) => sortCategory.appendChild(this.createTaskCard(task)));
        }
    }
}
