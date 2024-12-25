import '../styles/index.css';
import logo from '../images/logo.svg';
import avatar from '../images/avatar.jpg';
import { enableValidation } from './validate.js';
import { createCard } from './card.js';
import { openModal, closeModal, setPopupEventListeners } from './modal.js';
import { fetchUserInfo, fetchInitialCards, updateUserInfo, updateAvatar, addNewCard } from './api.js';

const placesList = document.querySelector('.places__list');
const profileImage = document.querySelector('.profile__image');
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const avatarEditPopup = document.querySelector('.popup_type_edit-avatar');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]');
const cardFormElement = document.querySelector('.popup__form[name="new-place"]');
const avatarFormElement = avatarEditPopup.querySelector('.popup__form[name="edit-avatar"]');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');
const cardNameInput = cardFormElement.querySelector('.popup__input_type_place-name');
const cardLinkInput = cardFormElement.querySelector('.popup__input_type_link');
const avatarInput = avatarFormElement.querySelector('.popup__input_type_avatar-link');

const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

let currentUserId = null;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.logo').src = logo;
    profileImage.style.backgroundImage = `url(${avatar})`;

    const validationConfig = {
        formSelector: '.popup__form',
        inputSelector: '.popup__input',
        submitButtonSelector: '.popup__button',
        inactiveButtonClass: 'popup__button_disabled',
        inputErrorClass: 'popup__input_type_error',
        errorClass: 'popup__error_type',
        errorClassActive: 'popup__error_active',
    };

    enableValidation(validationConfig);

    Promise.all([fetchUserInfo(), fetchInitialCards()])
        .then(([userData, cardsData]) => {
            currentUserId = userData._id;
            document.querySelector('.profile__title').textContent = userData.name;
            document.querySelector('.profile__description').textContent = userData.about;
            profileImage.style.backgroundImage = `url(${userData.avatar})`;

            cardsData.forEach(card => {
                placesList.append(createCard(card, handleImageClick, currentUserId));
            });
        })
        .catch(err => {
            console.error('Ошибка при загрузке данных:', err);
            alert('Не удалось загрузить данные. Попробуйте позже.');
        });

    profileEditButton.addEventListener('click', () => {
        nameInput.value = document.querySelector('.profile__title').textContent;
        jobInput.value = document.querySelector('.profile__description').textContent;
        openModal(profilePopup);
        setPopupEventListeners(profilePopup);
    });

    profileFormElement.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const newName = nameInput.value;
        const newAbout = jobInput.value;
        const saveButton = profileFormElement.querySelector('.popup__button');
        saveButton.textContent = "Сохранение...";

        updateUserInfo(newName, newAbout)
            .then(() => {
                document.querySelector('.profile__title').textContent = newName;
                document.querySelector('.profile__description').textContent = newAbout;
                closeModal(profilePopup);
            })
            .catch(console.error)
            .finally(() => saveButton.textContent = "Сохранить");
    });

    profileAddButton.addEventListener('click', () => {
        openModal(cardPopup);
        setPopupEventListeners(cardPopup);
    });

    cardFormElement.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const cardName = cardNameInput.value;
        const cardLink = cardLinkInput.value;
        const saveButton = cardFormElement.querySelector('.popup__button');
        saveButton.textContent = "Сохранение...";
    
        addNewCard(cardName, cardLink)
            .then(newCardData => {
                placesList.prepend(createCard(newCardData, handleImageClick, currentUserId));
                cardFormElement.reset();
                closeModal(cardPopup);
            })
            .catch(console.error)
            .finally(() => saveButton.textContent = "Сохранить");
    });
    
    const editAvatarButton = document.querySelector('.profile__edit-avatar');

    if (editAvatarButton) {
        editAvatarButton.addEventListener('click', () => {
            openModal(avatarEditPopup);
            setPopupEventListeners(avatarEditPopup);
        });
    } else {
        console.error("Иконка редактирования аватара не найдена!");
    }

    avatarFormElement.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const newAvatarLink = avatarInput.value;
        const saveButton = avatarFormElement.querySelector('.popup__button');
        saveButton.textContent = "Сохранение...";
    
        updateAvatar(newAvatarLink)
            .then(() => {
                profileImage.style.backgroundImage = `url(${newAvatarLink})`;
                avatarFormElement.reset();
                closeModal(avatarEditPopup);
            })
            .catch(console.error)
            .finally(() => saveButton.textContent = "Сохранить");
    });
    
    const closeImagePopupButton = imagePopup.querySelector('.popup__close');
    if (closeImagePopupButton) {
        closeImagePopupButton.addEventListener('click', () => {
            closeModal(imagePopup);
        });
    } else {
        console.error("Кнопка закрытия попапа с изображением не найдена!");
    }

    imagePopup.addEventListener('click', (evt) => {
        if (evt.target === imagePopup) {
            closeModal(imagePopup); 
        }
    });
});

const handleImageClick = (cardData) => {
    popupImage.src = cardData.link;
    popupImage.alt = cardData.name;
    popupCaption.textContent = cardData.name;
    openModal(imagePopup);
};
