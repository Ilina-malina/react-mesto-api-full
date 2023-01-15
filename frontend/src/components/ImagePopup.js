import React from "react";

function ImagePopup(props) {
  return (
    <div
      className={`popup popup_type_show-picture ${
        props.card ? "popup_opened" : ""
      }`}
    >
      <div className="popup__content">
        <button
          className="popup__close-button"
          type="button"
          aria-label="Закрыть"
          onClick={props.onClose}
        />
        <img
          className="popup__photo"
          alt={props.card ? props.card.name : ""}
          src={props.card ? props.card.link : ""}
        />
        <h2 className="popup__photo-title">
          {props.card ? props.card.name : ""}
        </h2>
      </div>
    </div>
  );
}

export default ImagePopup;
