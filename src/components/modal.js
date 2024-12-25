const MODAL_ANIMATION_DURATION = 600;

export function openModal(popup) {
    popup.classList.add('popup_is-animated', 'popup_is-opened');
    popup.style.visibility = 'visible';
    popup.style.opacity = '1';
    document.addEventListener('keydown', handleEscClose);
}

export function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
    popup.style.opacity = '0';

    setTimeout(() => {
        popup.style.visibility = 'hidden';
        popup.classList.remove('popup_is-animated');
    }, MODAL_ANIMATION_DURATION);

    document.removeEventListener('keydown', handleEscClose);
}

function handleEscClose(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
}

export function setPopupEventListeners(popup) {
    popup.addEventListener('click', (evt) => {
        if (evt.target === popup || evt.target.classList.contains('popup__close')) {
            closeModal(popup);
        }
    });
}
