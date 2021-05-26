import Task from './task.js';

function generateSaveProperty(saveIndex, property, value) {
    localStorage.setItem(`task_${saveIndex}_${property}`, value);
}

function getSaveProperty(saveIndex, property) {
    return localStorage.getItem(`task_${saveIndex}_${property}`);
}

function generateSaveProperties(saveIndex, task) {
    generateSaveProperty(saveIndex, 'title', task.title);
    generateSaveProperty(saveIndex, 'description', task.description);
    generateSaveProperty(saveIndex, 'finishDate', task.finishDate);
    generateSaveProperty(saveIndex, 'dueDate', task.dueDate);
    generateSaveProperty(saveIndex, 'createDate', task.createDate);
    generateSaveProperty(saveIndex, 'importance', task.importance);
    generateSaveProperty(saveIndex, 'finished', task.finished ? 1 : 0);
}

export function getTaskFromSaveIndex(saveIndex) {
    if (getSaveProperty(saveIndex, 'title') !== undefined && getSaveProperty(saveIndex, 'title') !== null) {
        return new Task(
            getSaveProperty(saveIndex, 'title'),
            getSaveProperty(saveIndex, 'description'),
            getSaveProperty(saveIndex, 'importance'),
            new Date(getSaveProperty(saveIndex, 'dueDate')),
            new Date(getSaveProperty(saveIndex, 'createDate')),
            new Date(getSaveProperty(saveIndex, 'finishDate')),
            Number(getSaveProperty(saveIndex, 'finished')) === 1,
        );
    }
        console.error(`load Task from saveIndex: ${saveIndex} failed...`);
        return null;
}

export function saveToLocalStorage(todoManager) {
    localStorage.clear();
    const tasksToSave = todoManager.getTaskListAsArray().filter((task) => !task.deleted);
    tasksToSave.forEach((task, index) => generateSaveProperties(index, task));
    localStorage.setItem('TaskNumber', tasksToSave.length);
}
