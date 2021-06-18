const defaultUrl = 'http://localhost';
const defaultPort = '3000';
const defaultFullAddress = `${defaultUrl}:${defaultPort}`;

export default {
    saveToNedb(task, callback) {
        fetch(`${defaultFullAddress}/tasks/add?task=${JSON.stringify(task)}`)
        .then((response) => {
            if (callback) {
                callback(response);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    },

    delete(id, callback) {
        fetch(`${defaultFullAddress}/tasks/del?id=${id}`)
        .then(() => {
           if (callback) callback();
        })
        .catch((error) => {
            console.error(error);
        });
    },

    update(id, task, callback) {
        fetch(`${defaultFullAddress}/tasks/update?id=${id}&task=${JSON.stringify(task)}`)
        .then(() => {
            if (callback) callback();
        })
        .catch((error) => {
            console.error(error);
        });
    },

    getAll(callback) {
        fetch(`${defaultFullAddress}/tasks`)
        .then((response) => {
            response.text().then((text) => callback(text));
        })
        .catch((error) => console.error(error));
    },
};
