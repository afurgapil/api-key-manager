const axios = require("axios");

module.exports = async function sendRequest(url, data) {
  const compUrl = `${url}?tags=${data}`;
  try {
    const response = await axios.get(compUrl);
    return response.data;
  } catch (error) {
    console.error("An error occured:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
};
