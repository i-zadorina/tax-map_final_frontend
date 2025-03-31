import { getToken } from "./token";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.tax.mappuchan.com"
    : "http://localhost:3002";

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

const request = (url, options) => {
  return fetch(`${baseUrl}/${url}`, options).then(checkResponse);
};

const signUp = ({ email, password, income, status }) => {
  return request("signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, income, status }),
  });
};

const login = ({ email, password }) => {
  return request("login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
};

const getUserInfo = (token) => {
  return request("users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateData = ({ income, status }) => {
  const token = getToken();
  return request("users/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ income, status }),
  });
};

export { signUp, login, updateData, getUserInfo };
