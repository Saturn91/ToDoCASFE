function toggleDarkTheme(event) {
    if (event.target.value === 'light') {
        document.body.classList.remove('dark-theme');
    } else {
        document.body.classList.add('dark-theme');
    }
}

const selectTheme = document.querySelector('[data_theme]');
selectTheme.addEventListener('change', (event) => toggleDarkTheme(event));
