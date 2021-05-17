const closeBtns = document.querySelectorAll('[data-close-popup]');
const popUpWindow = document.querySelector('[data-popup]');
const addTaskBtn = document.querySelector('[data-add-task]');

function showPopup(show) {
    if (show) {
        popUpWindow.style.display = 'block';
    } else {
        popUpWindow.style.display = 'none';
    }
}

showPopup(false);

addTaskBtn.addEventListener('click', () => {
    showPopup(true);
});

closeBtns.forEach((item) => {
    item.addEventListener('click', () => {
        showPopup(false);
    });
});
