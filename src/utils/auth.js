import { getToken } from './token';

const baseUrl = process.env.REACT_APP_API_BASE || 'http://localhost:3002';

if (!baseUrl) {
  throw new Error('REACT_APP_API_BASE is not defined');
}

async function checkResponse(res) {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.ok) return data;
  throw new Error(data.message || `HTTP ${res.status}`);
}

const request = (url, options) =>
  fetch(`${baseUrl}/${url}`, options).then(checkResponse);

const signUp = ({ email, password, income, status }) => {
  return request('signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, income, status }),
  });
};

const login = ({ email, password }) => {
  return request('login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
};

const getUserInfo = (token) => {
  return request('users/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateData = ({ income, status }) => {
  const token = getToken();
  return request('users/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ income, status }),
  });
};

export { signUp, login, updateData, getUserInfo };
