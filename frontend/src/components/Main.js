import React, { useContext } from "react";
import Card from "./Card.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { CardsContext } from "../contexts/CardsContext.js";

function Main(props) {
  const currentUser = useContext(CurrentUserContext);
  const cards = useContext(CardsContext);

  const onCardLike = (card) => {
    props.onCardLike(card);
  };

  const onCardDelete = (card) => {
    props.onCardDelete(card);
  };

  const cardsElements = cards.map((card) => (
    <Card
      key={card._id}
      card={card}
      onCardClick={props.onCardClick}
      onCardLike={onCardLike}
      onCardDelete={onCardDelete}
    />
  ));

  return (
    <main className="main">
      <section className="profile">
        <div
          className="profile__image"
          style={{ backgroundImage: `url(${currentUser.avatar})` }}
        >
          <div className="profile__overlay">
            <div
              className="profile__overlay-image"
              onClick={props.onEditAvatar}
            ></div>
          </div>
        </div>
        <div className="profile__info">
          <div className="profile__container">
            <h1 className="profile__name">{currentUser.name}</h1>
            <button
              className="profile__edit-button"
              type="button"
              aria-label="Редактировать профиль"
              onClick={props.onEditProfile}
            ></button>
          </div>
          <p className="profile__subscribe">{currentUser.about}</p>
        </div>
        <button
          className="profile__add-button"
          type="button"
          aria-label="Добавить информацию"
          onClick={props.onAddPlace}
        ></button>
      </section>
      <section className="elements">{cardsElements}</section>
    </main>
  );
}

export default Main;
