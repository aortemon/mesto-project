export function enableValidation(config) {
    const forms = Array.from(document.querySelectorAll(config.formSelector));
    forms.forEach((form) => {
        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
        });
        setEventListeners(form, config);
    });
}

function setEventListeners(form, config) {
    const inputs = Array.from(form.querySelectorAll(config.inputSelector));
    const button = form.querySelector(config.submitButtonSelector);

    toggleButtonState(inputs, button, config);

    inputs.forEach((input) => {
        input.addEventListener('input', () => {
            checkInputValidity(input, form, config);
            toggleButtonState(inputs, button, config);
        });
    });
}

function checkInputValidity(inputElement, form, config) {
    if (!inputElement.validity.valid) {
        showInputError(inputElement, form, config);
    } else {
        hideInputError(inputElement, form, config);
    }
}

function showInputError(inputElement, form, config) {
    const errorElement = form.querySelector(`.${config.errorClass}_${inputElement.name}`);
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = inputElement.validationMessage;
    errorElement.classList.add(config.errorClassActive);
}

function hideInputError(inputElement, form, config) {
    const errorElement = form.querySelector(`.${config.errorClass}_${inputElement.name}`);
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.classList.remove(config.errorClassActive);
    errorElement.textContent = '';
}

function toggleButtonState(inputs, button, config) {
    if (hasInvalidInput(inputs)) {
        button.setAttribute('disabled', true);
        button.classList.add(config.inactiveButtonClass);
    } else {
        button.removeAttribute('disabled');
        button.classList.remove(config.inactiveButtonClass);
    }
}

function hasInvalidInput(inputs) {
    return inputs.some((input) => !input.validity.valid);
}