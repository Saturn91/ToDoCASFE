import Datastore from 'nedb';

class TaskStorage {
    constructor() {
        this.db = new Datastore({filename: './data/tasks.db', autoload: true});
    }

    add(newTask, callback) {
        this.db.insert({task: newTask}, (err, newEntry) => {
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
        this.db.update({_id: id}, {$set: {task: updatedTask}},
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

export const taskStore = new TaskStorage();
