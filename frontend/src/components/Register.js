import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register(props) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegisterButton = (e) => {
    e.preventDefault();
    props.onRegister(formData.email, formData.password);
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h2 className="auth__title">Регистрация</h2>
        <form
          className="auth__form"
          name="auth-form"
          onSubmit={handleRegisterButton}
        >
          <input
            className="auth__input"
            name="email"
            value={formData.value}
            required
            type="email"
            placeholder="Email"
            onChange={handleInput}
          />
          <input
            className="auth__input"
            name="password"
            value={formData.value}
            required
            type="password"
            placeholder="Пароль"
            onChange={handleInput}
          />
          <button
            className="auth__submit-button"
            type="submit"
            aria-label="Зарегистрироваться"
          >
            Зарегистрироваться
          </button>
        </form>
        <Link className="auth__link" to="/signin">
          Уже зарегистрированы? Войти
        </Link>
      </div>
    </div>
  );
}

export default Register;