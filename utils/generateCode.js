const crypto = require("crypto");

module.exports = function generateCode() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(3, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const code = buffer.readUIntBE(0, 3);
        const sixDigitCode = (code % 900000) + 100000;
        resolve(sixDigitCode);
      }
    });
  });
};

//TODO TEST ET
