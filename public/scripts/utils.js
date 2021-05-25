export default function getKeyByValueFromObject(value, object) {
    return Object.keys(object).find((key) => object[key] === value);
}