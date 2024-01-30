module.exports = function decrypt(key, encryptedData) {
  const decoded = Buffer.from(encryptedData, "base64").toString("utf8");
  console.log(decoded);
  const value = decoded.substring(0, decoded.length - key.length);
  console.log(value);
  return value;
};
