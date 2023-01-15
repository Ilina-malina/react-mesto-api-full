import React, { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Card(props) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = props.card.owner._id === currentUser._id;
  const isLiked = props.card.likes.some((item) => item === currentUser._id);

  const handleCardClick = () => {
    props.onCardClick(props.card);
  };

  const handleLikeClick = () => {
    props.onCardLike(props.card);
  };

  const handleDeleteClick = () => {
    props.onCardDelete(props.card);
  };

  return (
    <article className="element">
      <img
        className="element__photo"
        src={props.card.link}
        alt={props.card.name}
        onClick={handleCardClick}
      />
      {isOwn ? (
        <button
          className="element__delete-button"
          type="button"
          aria-label="Удалить"
          onClick={handleDeleteClick}
        ></button>
      ) : (
        ""
      )}
      <div className="element__description">
        <h2 className="element__title">{props.card.name}</h2>
        <div className="element__likes-container">
          <button
            className={`element__like-button ${
              isLiked ? "element__like-button_active" : ""
            }`}
            type="button"
            aria-label="Нравится"
            onClick={handleLikeClick}
          ></button>
          <p className="element__likes-amount">{props.card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;
