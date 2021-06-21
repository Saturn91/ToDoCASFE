import showEditTaskPopUp from './edit-popup.js';
import showWarningPopUp from './warning-popup.js';
import sortService from '../services/sort-service.js';
import buildHtml from '../services/build-html-service.js';

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
            buildHtml.clearList();
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
        const sorted = this.toDoManager.getTasks()
            .sort((a, b) => sortService.sortCreatedDate(a, b));

        const pastTasks = sorted.filter((task) => task.createDate < today);
        buildHtml.addNewSortCategory('created in past:', pastTasks);

        const todaysTasks = sorted
        .filter((task) => task.createDate.getMonth() === today.getMonth()
            && task.createDate.getDate() === today.getDate()
            && task.createDate.getFullYear() === today.getFullYear());
            buildHtml.addNewSortCategory('created today:', todaysTasks);
        this.addCardsEvenListeners(this.toDoManager.getTasks());
    }

    finishedListDisplay() {
        const sorted = this.toDoManager.getFinishedTask()
            .sort((a, b) => sortService.sortFinishedDate(a, b));
            buildHtml.addNewSortCategory('finished: ', sorted);
        this.addCardsEvenListeners(this.toDoManager.getFinishedTask());
    }

    dueDateSortDisplay() {
        const sorted = this.toDoManager.getTasks().sort((a, b) => sortService.sortDueDate(a, b));

        const lateTasks = sorted.filter((task) => task.dueDate < today);
        buildHtml.addNewSortCategory('late tasks:', lateTasks);

        const todaysTasks = sorted
        .filter((task) => task.dueDate.getMonth() === today.getMonth()
            && task.dueDate.getDate() === today.getDate()
            && task.dueDate.getFullYear() === today.getFullYear());
            buildHtml.addNewSortCategory('today:', todaysTasks);

        const tomorrowsTasks = sorted
        .filter((task) => task.dueDate.getDate() === tommorow.getDate()
        && task.dueDate.getMonth() === tommorow.getMonth()
        && task.dueDate.getFullYear() === tommorow.getFullYear());
        buildHtml.addNewSortCategory('tomorrow:', tomorrowsTasks);

        const thisWeekTasks = sorted
        .filter((task) => task.dueDate.getTime() >= restOfWeekStart.getTime()
        && task.dueDate.getTime() < endOfThisWeek.getTime());
        buildHtml.addNewSortCategory('this week:', thisWeekTasks);

        const nextWeekTasks = sorted
        .filter((task) => task.dueDate.getTime() >= endOfThisWeek.getTime()
        && task.dueDate.getTime() < endOfWeekAfter.getTime());
        buildHtml.addNewSortCategory('next week:', nextWeekTasks);

        const laterTasks = sorted
        .filter((task) => task.dueDate.getTime() >= endOfWeekAfter.getTime());
        buildHtml.addNewSortCategory('later:', laterTasks);
        this.addCardsEvenListeners(sorted);
    }

    importanceSortDisplay() {
        const sorted = this.toDoManager.getTasks().sort((a, b) => sortService.sortImportance(a, b));
        buildHtml.addNewSortCategory('High Prio: ', sorted.filter((task) => task.importance === '1'));
        buildHtml.addNewSortCategory('Medium Prio: ', sorted.filter((task) => task.importance === '2'));
        buildHtml.addNewSortCategory('Low Prio: ', sorted.filter((task) => task.importance === '3'));
        this.addCardsEvenListeners(this.toDoManager.getTasks());
    }

    addCardsEvenListeners(tasks) {
        tasks.forEach((task) => this.addEventlisteners(task, this.toDoManager, this));
        buildHtml.updateAddTaskBtns(this, this.toDoManager);
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
