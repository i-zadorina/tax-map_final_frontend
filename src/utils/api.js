function exchangeRatesApi() {
  return fetch("https://open.er-api.com/v6/latest/USD")
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching exchange rates", error);
      throw error;
    });
}

export { exchangeRatesApi };
