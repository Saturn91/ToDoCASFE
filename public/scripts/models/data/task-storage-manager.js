import Task from '../task.js';

const taskSaveString = 'task_';
const taskNumberSaveString = 'TaskNumber';

function generateSaveProperties(saveIndex, task) {
    localStorage.setItem(`task_${saveIndex}`, JSON.stringify(task));
}

export function getTaskFromSaveIndex(saveIndex) {
    const data = JSON.parse(localStorage.getItem(`${taskSaveString}${saveIndex}`));
    const task = new Task(data.title, data.description, data.importance, new Date(data.dueDate),
        new Date(data.createDate), new Date(data.finishDate), data.finished);

    if (task === undefined) {
        console.error(`load Task from saveIndex: ${saveIndex} failed...`);
        return null;
    }

    return task;
}

/* use this instead of localStorage.clear (which clears everything!) */
function clearTasksInLocalStorage() {
    for (let i = 0; i < localStorage.getItem(taskNumberSaveString); i++) {
        localStorage.removeItem(`${taskSaveString}${i}`);
    }
}

export function saveToLocalStorage(todoManager) {
    clearTasksInLocalStorage();
    const tasksToSave = todoManager.getTaskListAsArray().filter((task) => !task.deleted);
    tasksToSave.forEach((task, index) => generateSaveProperties(index, task));
    localStorage.setItem(taskNumberSaveString, tasksToSave.length);
}
