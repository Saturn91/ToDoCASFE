const themePropertyTag = 'themeProperty';

export default {
    storeProperties(theme) {
        localStorage.setItem(themePropertyTag, theme);
    },
    getProperties() {
        return {
            theme: localStorage.getItem(themePropertyTag),
        };
    },
};
