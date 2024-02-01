const useUser = require("./basicQueries/useUser");

module.exports = function isValidToken(mail, token) {
  return new Promise(async (resolve, reject) => {
    const user = await useUser("mail", mail);
    if (user.verification_code === token) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
