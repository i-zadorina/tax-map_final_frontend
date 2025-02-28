const baseUrl = "http://localhost:3001";
// const baseUrl =
//   process.env.NODE_ENV === "production"
//     ? "https://api.wtwr.teachmetofish.net"
//     : "http://localhost:3001";

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

const request = (url, options) => {
  return fetch(`${baseUrl}/${url}`, options).then(checkResponse);
};

export { request, checkResponse };
