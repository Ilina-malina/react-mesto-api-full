import React from "react";

function InfoTooltip(props) {
  return (
    <div
      className={`popup popup_type_register ${
        props.tooltipState.isOpen ? "popup_opened" : ""
      }`}
    >
      <div className="popup__info-container">
        <button
          className="popup__close-button"
          type="button"
          aria-label="Закрыть"
          onClick={props.onClose}
        />
        <img className="popup__info-image" src={props.tooltipState.image} />
        <h2 className="popup__info-title">{props.tooltipState.title}</h2>
      </div>
    </div>
  );
}

export default InfoTooltip;
