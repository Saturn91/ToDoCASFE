export default {
    sortCreatedDate(a, b) {
        return a.createdDate - b.createdDate;
    },
    sortFinishedDate(a, b) {
        return a.finishDate - b.finishDate;
    },
    sortImportance(a, b) {
        return a.importance - b.importance;
    },
    sortDueDate(a, b) {
        return a.dueDate - b.dueDate;
    },
};
