const defaultUrl = 'http://localhost';
const defaultPort = '5000';
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
            // eslint-disable-next-line no-console
            console.error(error);
        });
    },

    delete(id, callback) {
        fetch(`${defaultFullAddress}/tasks/del?id=${id}`)
        .then(() => {
           if (callback) callback();
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
        });
    },

    update(id, task, callback) {
        fetch(`${defaultFullAddress}/tasks/update?id=${id}&task=${JSON.stringify(task)}`)
        .then(() => {
            if (callback) callback();
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
        });
    },

    getAll(callback) {
        fetch(`${defaultFullAddress}/tasks`)
        .then((response) => {
            response.text().then((text) => callback(text));
        })
        // eslint-disable-next-line no-console
        .catch((error) => console.error(error));
    },
};
