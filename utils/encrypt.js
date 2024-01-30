module.exports = function encrypt(data) {
  const encoded = Buffer.from(data, "utf8").toString("base64");
  return encoded;
};
