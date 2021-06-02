export default {
    getKeyByValueFromObject(value, object) {
        return Object.keys(object).find((key) => object[key] === value);
    },
    getLocalFromDate(date) {
        const local = date;
        local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
        return local.toJSON().slice(0, 10);
    }
}
