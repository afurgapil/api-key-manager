const axios = require("axios");

module.exports = async function sendRequest(url, data) {
  const compUrl = `${url}?tags=${data}`;

  try {
    console.log("Gönderilen URL:", compUrl);
    const response = await axios.get(compUrl);
    return response.data;
  } catch (error) {
    console.error("Hata oluştu:", error.message);
    if (error.response) {
      console.error("Response Durumu:", error.response.status);
      console.error("Response Verisi:", error.response.data);
    }
    throw error;
  }
};
