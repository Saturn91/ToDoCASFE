import showEditTaskPopUp from './edit-popup.js';
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
const endOfWeekAfter = new Date(
    endOfThisWeek.getTime() + (7 - today.getDay() + 1) * 24 * 60 * 60 * 1000,
    );

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

function getCardFooterAsHtml(task) {
    return task.finished ? cardFooterDone({id: task.id}) : cardFooterTodo({id: task.id});
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

function createTaskCard(task) {
    const newCard = document.createElement('div');
    newCard.classList.add('task-card');
    // eslint-disable-next-line no-underscore-dangle
    newCard.id = task.id;
    const html = cardDetailsCompiled(
        {title: task.title,
        priority: getPriorityHtml(task),
        dueDateString: `${task.dueDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.dueDate.getFullYear()}`,
        createDateString: `${task.createDate.getDate()}/${task.dueDate.getMonth() + 1}/${task.createDate.getFullYear()}`,
        finshedDateString: `${getFinishedDateAsHtml(task)}`,
        description: task.description},
        );
    newCard.innerHTML = html + getCardFooterAsHtml(task);
    return newCard;
}

function addNewSortCategory(sortCatTitle, tasks) {
    if (tasks.length > 0) {
        listParent.innerHTML += sortListCategory({id: sortCatTitle});
        const sortCategory = document.getElementById(`sort-cat-${sortCatTitle}`);
        document.getElementById(`sort-cat-title-${sortCatTitle}`).innerText = sortCatTitle;
        tasks.forEach((task) => sortCategory.appendChild(createTaskCard(task)));
    }
}

export default class View {
    constructor(toDoManager) {
        this.toDoManager = toDoManager;
        this.cardList = [];
        this.displayType = {
            default: 1,
            createdDate: 0,
            sortDueDate: 1,
            sortImportance: 2,
            showFinised: 3};
    }

    updateView(displayType) {
        this.toDoManager.loadTasks(() => {
        clearList();
        if (displayType !== undefined) {
            switch (displayType) {
                case this.displayType.createdDate:
                    this.createdListDisplay();
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
            this.dueDateSortDisplay();
        }
        });
    }

    createdListDisplay() {
        const sorted = this.toDoManager.getTasks().sort((a, b) => sortCreatedDate(a, b));

        const pastTasks = sorted.filter((task) => task.createDate < today);
        addNewSortCategory('created in past:', pastTasks);

        const todaysTasks = sorted
        .filter((task) => task.createDate.getMonth() === today.getMonth()
            && task.createDate.getDate() === today.getDate()
            && task.createDate.getFullYear() === today.getFullYear());
        addNewSortCategory('created today:', todaysTasks);
        this.addCardsEvenListeners(this.toDoManager.getTasks());
    }

    finishedListDisplay() {
        const sorted = this.toDoManager.getFinishedTask().sort((a, b) => sortFinishedDate(a, b));
        addNewSortCategory('finished: ', sorted);
        this.addCardsEvenListeners(this.toDoManager.getFinishedTask());
    }

    dueDateSortDisplay() {
        const sorted = this.toDoManager.getTasks().sort((a, b) => sortDueDate(a, b));

        const lateTasks = sorted.filter((task) => task.dueDate < today);
        addNewSortCategory('late tasks:', lateTasks);

        const todaysTasks = sorted
        .filter((task) => task.dueDate.getMonth() === today.getMonth()
            && task.dueDate.getDate() === today.getDate()
            && task.dueDate.getFullYear() === today.getFullYear());
        addNewSortCategory('today:', todaysTasks);

        const tomorrowsTasks = sorted
        .filter((task) => task.dueDate.getDate() === tommorow.getDate()
        && task.dueDate.getMonth() === tommorow.getMonth()
        && task.dueDate.getFullYear() === tommorow.getFullYear());
        addNewSortCategory('tomorrow:', tomorrowsTasks);

        const thisWeekTasks = sorted
        .filter((task) => task.dueDate.getTime() >= restOfWeekStart.getTime()
        && task.dueDate.getTime() < endOfThisWeek.getTime());
        addNewSortCategory('this week:', thisWeekTasks);

        const nextWeekTasks = sorted
        .filter((task) => task.dueDate.getTime() >= endOfThisWeek.getTime()
        && task.dueDate.getTime() < endOfWeekAfter.getTime());
        addNewSortCategory('next week:', nextWeekTasks);

        const laterTasks = sorted
        .filter((task) => task.dueDate.getTime() >= endOfWeekAfter.getTime());
        addNewSortCategory('later:', laterTasks);
        this.addCardsEvenListeners(sorted);
    }

    importanceSortDisplay() {
        const sorted = this.toDoManager.getTasks().sort((a, b) => sortImportance(a, b));
            addNewSortCategory('High Prio: ', sorted.filter((task) => task.importance === '1'));
            addNewSortCategory('Medium Prio: ', sorted.filter((task) => task.importance === '2'));
            addNewSortCategory('Low Prio: ', sorted.filter((task) => task.importance === '3'));
        this.addCardsEvenListeners(this.toDoManager.getTasks());
    }

    addCardsEvenListeners(tasks) {
        tasks.forEach((task) => this.addEventlisteners(task, this.toDoManager, this));
        updateAddTaskBtns(this, this.toDoManager);
    }

    addEventlisteners(task, toDoManager, view) {
        const newCard = document.getElementById(task.id);
        if (!task.finished) {
            newCard.addEventListener('click', (event) => {
                if (event.target.name !== 'done' && event.target.name !== 'cancel') {
                    showEditTaskPopUp(
                        (updatedTask) => {
                            toDoManager.updateTask(task.id, updatedTask);
                            this.updateView(this.displayType.sortDueDate);
                        },
                        task,
                    );
                }
            });
            newCard.querySelector('[data-done-btn]').addEventListener('click', () => showWarningPopUp('Finish Task?', 'By answering yes the task will get moved into the "finished Task" list', () => {
                toDoManager.finishTaskById(task.id);
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
            toDoManager.removefromTaskList(task.id);
            this.updateView();
        }));
    }
}
