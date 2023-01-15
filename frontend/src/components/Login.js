import React, { useState } from "react";

function Login(props) {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleLoginButton = (e) => {
    e.preventDefault();
    props.onLogin(userData.email, userData.password);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  return (
    <div className="auth">
      <div className="auth__container">
        <h2 className="auth__title">Вход</h2>
        <form
          className="auth__form"
          name="login-form"
          onSubmit={handleLoginButton}
        >
          <input
            className="auth__input"
            name="email"
            value={userData.email}
            required
            type="email"
            placeholder="Email"
            onChange={handleInput}
          />
          <input
            className="auth__input"
            name="password"
            value={userData.password}
            required
            type="password"
            placeholder="Пароль"
            onChange={handleInput}
          />
          <button
            className="auth__submit-button"
            type="submit"
            aria-label="Войти"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
