import React, { useState, useEffect, useCallback } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import "../index.css";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import { CardsContext } from "../contexts/CardsContext.js";
import ProtectedRoute from "./ProtectedRoute.js";
import Header from "./Header.js";
import Login from "./Login.js";
import Register from "./Register.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm.js";
import ImagePopup from "./ImagePopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import InfoTooltip from "./InfoTooltip.js";
import { api } from "../utils/Api.js";
import * as auth from "../utils/Auth.js";
import success from "../images/success.svg";
import fail from "../images/fail.svg";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({ name: "", about: "" });
  const [tooltipState, setTooltipState] = useState({
    isOpen: false,
    title: "",
    image: "",
  });
  const [cards, setCards] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (isLoggedIn) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then((values) => {
          setCurrentUser(values[0]);
          setCards(values[1]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isLoggedIn]);

  const handleLike = (card) => {
    const isLiked = card.likes.some((item) => item === currentUser._id);
    if (isLiked) {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((cards) =>
            cards.map((item) => (card._id === item._id ? newCard : item))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .putLike(card._id)
        .then((newCard) => {
          setCards((cards) =>
            cards.map((item) => (card._id === item._id ? newCard : item))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCardDelete = (card) => {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkToken = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.log("No token in storage");
      return;
    }
    const user = await auth.checkToken(token);
    if (!user) {
      console.log("Invalid user");
      return;
    }
    setUserData(user);

    setIsLoggedIn(true);
    history.push("/");
  };

  useEffect(() => {
    checkToken();
  }, []);

  const login = async (email, password) => {
    const data = await auth.login(email, password);
    if (!data) {
      console.log("Что-то пошло не так");
    }
    if (data) {
      localStorage.setItem("jwt", data.token);
      setIsLoggedIn(true);
      setUserData({ email: email, password: password });
      history.push("/");
    }
  };

  const signOut = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    history.push("/signin");
  };

  const register = useCallback(async (email, password) => {
    try {
      const data = await auth.register(email, password);
      if (!data) {
        setTooltipState({
          isOpen: true,
          title: "Что-то пошло не так! Попробуйте ещё раз.",
          image: fail,
        });
      }
      if (data) {
        setIsLoggedIn(true);
        setUserData({
          email: data.email,
          password: data.password,
        });
        setTooltipState({
          isOpen: true,
          title: "Вы успешно зарегистрировались!",
          image: success,
        });
        history.push("/signin");
      }
    } catch {
      setTooltipState({
        isOpen: true,
        title: "Что-то пошло не так! Попробуйте ещё раз.",
        image: fail,
      });
    }
  }, []);

  function handleUpdateUser(name, about) {
    api
      .editUserInfo(name, about)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(avatar) {
    api
      .editUserAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(name, link) {
    api
      .addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setTooltipState({ isOpen: false });
    setSelectedCard(null);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CardsContext.Provider value={cards}>
        <div className="App">
          <Header userData={userData} onSignOut={signOut} />
          <Switch>
            <ProtectedRoute
              exact
              path="/"
              component={Main}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onCardClick={setSelectedCard}
              onCardLike={handleLike}
              onCardDelete={handleCardDelete}
              isLoggedIn={isLoggedIn}
            />
            <Route path="/signup">
              <Register onRegister={register} isLoggedIn={isLoggedIn} />
            </Route>
            <Route path="/signin">
              <Login onLogin={login} isLoggedIn={isLoggedIn} />
            </Route>
            <Route>
              {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
            </Route>
          </Switch>

          <Footer />
          <InfoTooltip tooltipState={tooltipState} onClose={closeAllPopups} />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />
          <PopupWithForm
            name="delete-confirmation"
            title="Вы уверены?"
            onClose={closeAllPopups}
          >
            <button
              className="popup__submit-button"
              type="submit"
              aria-label="Да"
            >
              Подтвердить
            </button>
          </PopupWithForm>
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
      </CardsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
