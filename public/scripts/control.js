const closeBtns = document.querySelectorAll('[data-close-popup]');
const popUpWindow = document.querySelector('[data-popup]');
const addTaskBtn = document.querySelector('[data-add-task]');
const newTaskSubmitBtn = document.querySelector('[data-submit-task]');
const warningDisplay = document.querySelector('[data-form-msg]');

/* Popup show/hide */

function showPopup(show) {
    if (show) {
        popUpWindow.style.display = 'block';
        warningDisplay.style.display = 'none';
        /* Set Date to default 'today' */
        const local = new Date();
        local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
        popUpWindow.querySelector('input[name="duedate"]').value = local.toJSON().slice(0, 10);
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

/* submit new task */

function showInvalid(msg) {
    warningDisplay.style.display = 'block';
    warningDisplay.textContent = msg;
}

function checknewTaskFormValid() {
    let valid = true;
    if (!popUpWindow.querySelector('input[name="description"]').checkValidity()) {
        showInvalid('please enter a description');
        valid = false;
    }
    if (!popUpWindow.querySelector('input[name="prio"]').checkValidity()) {
        showInvalid('priority has to be a value between 1 and 3');
        valid = false;
    }
    if (!popUpWindow.querySelector('input[name="title"]').checkValidity()) {
        showInvalid('please enter a title');
        valid = false;
    }
    return valid;
}

newTaskSubmitBtn.addEventListener('click', () => {
   if (checknewTaskFormValid()) {
       warningDisplay.style.display = 'none';
       showPopup(false);
   }
});
