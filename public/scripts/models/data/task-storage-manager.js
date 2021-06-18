const defaultUrl = 'http://localhost';
const defaultPort = '3000';
const defaultFullAddress = `${defaultUrl}:${defaultPort}`;

export default {
    saveToNedb(task) {
        fetch(`${defaultFullAddress}/tasks/add?task=${JSON.stringify(task)}`)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    },

    delete(id) {
        fetch(`${defaultFullAddress}/tasks/del?id=${id}`)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
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
