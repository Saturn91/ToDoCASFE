import Datastore from 'nedb';

class TaskStorage {
    constructor() {
        this.db = new Datastore({filename: './data/tasks.db', autoload: true});
    }

    add(newTask, callback) {
        this.db.insert({
            title: newTask.title,
            description: newTask.description,
            finishDate: newTask.finishDate,
            dueDate: newTask.dueDate,
            createDate: newTask.createDate,
            importance: newTask.importance,
            finished: newTask.finished,
            deleted: newTask.deleted,
        }, (err, newEntry) => {
            if (callback) {
                callback(err, newEntry);
            }
        });
    }

    delete(id, callback) {
        this.db.update({_id: id}, {$set: {state: 'DELETED'}}, {returnUpdatedDocs: true}, (err, numDocs, doc) => {
            if (callback) {
                callback(err, doc);
            }
        });
    }

    update(id, updatedTask, callback) {
        this.db.update({_id: id}, {$set: {
            title: updatedTask.title,
            description: updatedTask.description,
            finishDate: updatedTask.finishDate,
            dueDate: updatedTask.dueDate,
            createDate: updatedTask.createDate,
            importance: updatedTask.importance,
            finished: updatedTask.finished,
            deleted: updatedTask.deleted,
        }},
         {returnUpdatedDocs: true}, (err, numDocs, doc) => {
            if (callback) {
                callback(err, doc);
            }
        });
    }

    get(id, callback) {
        this.db.findOne({_id: id}, (err, doc) => {
            callback(err, doc);
        });
    }

    all(callback) {
        this.db.find({}, (err, docs) => {
            callback(err, JSON.stringify(docs));
        });
    }
}

const taskStore = new TaskStorage();

export default taskStore;
