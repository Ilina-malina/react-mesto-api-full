class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  getInitialCards() {
    return fetch(this._baseUrl + "/cards", {
      headers: this._getHeaders(),
    }).then(this._checkStatus);
  }

  addCard = (card) => {
    return fetch(this._baseUrl + "/cards", {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(card),
    }).then(this._checkStatus);
  };

  deleteCard(cardId) {
    return fetch(this._baseUrl + "/cards/" + cardId, {
      method: "DELETE",
      headers: this._getHeaders(),
    }).then(this._checkStatus);
  }

  getUserInfo() {
    return fetch(this._baseUrl + "/users/me", {
      headers: this._getHeaders(),
    }).then(this._checkStatus);
  }

  editUserInfo(name, about) {
    return fetch(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({ name, about }),
    }).then(this._checkStatus);
  }

  editUserAvatar(avatar) {
    return fetch(this._baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({ avatar }),
    }).then(this._checkStatus);
  }

  putLike(cardId) {
    return fetch(this._baseUrl + "/cards/" + cardId + "/likes", {
      method: "PUT",
      headers: this._getHeaders(),
    }).then(this._checkStatus);
  }

  deleteLike(cardId) {
    return fetch(this._baseUrl + "/cards/" + cardId + "/likes", {
      method: "DELETE",
      headers: this._getHeaders(),
    }).then(this._checkStatus);
  }

  _checkStatus(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _getHeaders = () => {
    const token = localStorage.getItem("jwt");
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }
}

export const api = new Api({
  baseUrl: "https://api.moe-mesto.nomoredomains.club",
});

