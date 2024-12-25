import { toggleLike, deleteCard } from './api.js';

export function createCard(cardData, handleImageClick, currentUserId) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.cloneNode(true).firstElementChild;

    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const likeButton = cardElement.querySelector('.card__like-button');
    const likeCount = cardElement.querySelector('.card__like-count');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;
    likeCount.textContent = cardData.likes.length;

    if (cardData.owner._id === currentUserId) {
        deleteButton.style.display = 'block';
    } else {
        deleteButton.style.display = 'none';
    }

    if (cardData.likes.some(user => user._id === currentUserId)) {
        likeButton.classList.add('card__like-button_is-active');
    } else {
        likeButton.classList.remove('card__like-button_is-active');
    }

    likeButton.addEventListener('click', () => {
        const isLiked = likeButton.classList.contains('card__like-button_is-active');
        toggleLike(cardData._id, isLiked)
            .then(updatedCard => {
                cardData = updatedCard;
                likeCount.textContent = cardData.likes.length; 
                
                if (cardData.likes.some(user => user._id === currentUserId)) {
                    likeButton.classList.add('card__like-button_is-active');
                } else {
                    likeButton.classList.remove('card__like-button_is-active');
                }
            })
            .catch(console.error);
    });

    deleteButton.addEventListener('click', () => {
        deleteCard(cardData._id)
            .then(() => cardElement.remove())
            .catch(console.error);
    });

    cardImage.addEventListener('click', () => {
        handleImageClick(cardData);
    });
    return cardElement;
}
