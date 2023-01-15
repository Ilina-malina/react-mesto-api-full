import React, { useRef, useEffect } from "react";
import PopupWithForm from "./PopupWithForm.js";

function EditAvatarPopup(props) {
  const avatarRef = useRef();

  useEffect(() => {
    if (props.isOpen) {
      avatarRef.current.value = "";
    }
  }, [props.isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar(avatarRef.current.value);
  }

  return (
    <PopupWithForm
      name="avatar"
      title="Обновить аватар"
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <form
        className="popup__form"
        name="avatar-form"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="popup__input-zone">
          <input
            className="popup__input popup__input_type_link"
            ref={avatarRef}
            required
            type="url"
            placeholder="Ссылка на картинку"
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

export default EditAvatarPopup;
