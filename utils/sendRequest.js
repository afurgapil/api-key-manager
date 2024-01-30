const axios = require("axios");

module.exports = async function sendRequest(url, prompt) {
  const response = await axios.post(url, { prompt });

  return response;
};
