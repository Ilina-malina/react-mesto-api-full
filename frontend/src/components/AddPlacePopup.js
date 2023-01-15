import React, { useEffect, useState } from "react";
import PopupWithForm from "./PopupWithForm.js";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setLink("");
    }
  }, [isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlace(name, link);
  }

  return (
    <PopupWithForm
      name="place"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form
        className="popup__form"
        name="add-place__form"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="popup__input-zone">
          <input
            className="popup__input popup__input_type_place"
            onChange={handleNameChange}
            required
            type="text"
            value={name}
            minLength="1"
            maxLength="30"
            placeholder="Название"
          />
          <span className="popup__error"></span>
        </div>
        <div className="popup__input-zone">
          <input
            className="popup__input popup__input_type_link"
            onChange={handleLinkChange}
            required
            type="url"
            value={link}
            placeholder="Ссылка на картинку"
          />
          <span className="popup__error"></span>
        </div>
        <button
          className="popup__submit-button popup__submit-button_disadled"
          type="submit"
          aria-label="Создать"
        >
          Создать
        </button>
      </form>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
