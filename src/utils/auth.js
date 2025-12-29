import { getToken } from "./token";

const baseUrl = process.env.REACT_APP_API_BASE || "http://localhost:3002";

async function checkResponse(res) {
  const data = await res.json();

  if (res.ok) {
    return data;
  }

  return Promise.reject(new Error(data.message));
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
