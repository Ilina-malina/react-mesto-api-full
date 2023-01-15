import React from "react";

const BASE_URL = "https://api.moe-mesto.nomoredomains.club";

export const register = async (email, password) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return checkResponse(res);
};

export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return checkResponse(res);
};

export const checkToken = async (token) => {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  console.log(res);
  return checkResponse(res);
};

const checkResponse = (res) =>
  res.ok ? res.json() : Promise.reject(`Error: ${res.statusText}`);
