import React, { useState, useEffect, useContext } from "react";
import PopupWithForm from "./PopupWithForm.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function EditProfilePopup(props) {
  const currentUser = useContext(CurrentUserContext);

  const [name, setName] = useState(currentUser.name);
  const [description, setDescription] = useState(currentUser.about);

  useEffect(() => {
    if (props.isOpen) {
      setName(currentUser.name);
      setDescription(currentUser.about);
    }
  }, [props.isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateUser(name, description);
  }

  return (
    <PopupWithForm
      name="profile"
      title="Редактировать профиль"
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <form
        className="popup__form"
        name="profile-form"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="popup__input-zone">
          <input
            className="popup__input popup__input_type_name"
            required
            type="text"
            value={name}
            onChange={handleNameChange}
            minLength="2"
            maxLength="40"
            placeholder="Введите Ваше имя"
          />
          <span className="popup__error"></span>
        </div>
        <div className="popup__input-zone">
          <input
            className="popup__input popup__input_type_description"
            required
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            minLength="2"
            maxLength="200"
            placeholder="Укажите род занятий"
          />
          <span className="popup__error"></span>
        </div>
        <button
          className="popup__submit-button"
          type="submit"
          aria-label="Сохранить"
        >
          Сохранить
        </button>
      </form>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
