const warningPopup = document.querySelector('[data-warning-popup]');
let callbackFunctionOnCloseWarning = null;
let callbackFunctionOnConfirmWarning = null;

document.querySelector('[data-warning-confirm]').addEventListener('click', () => {
    if (callbackFunctionOnConfirmWarning != null) {
        callbackFunctionOnConfirmWarning();
    }

    warningPopup.style.display = 'none';
});

document.querySelectorAll('[data-warning-cancel]').forEach((btn) => btn.addEventListener('click', () => {
    if (callbackFunctionOnCloseWarning != null) {
        callbackFunctionOnCloseWarning();
    }

    warningPopup.style.display = 'none';
}));

export default function showWarningPopUp(title, msg, callbackOnYes, callBackOnNo) {
    warningPopup.style.display = 'block';
    document.querySelector('[data-warning-title]').textContent = title;
    document.querySelector('[data-warning-msg]').textContent = msg;
    callbackFunctionOnConfirmWarning = callbackOnYes;
    callbackFunctionOnCloseWarning = callBackOnNo;
}
