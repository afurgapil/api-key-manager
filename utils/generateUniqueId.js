const { v4: uuidv4 } = require("uuid");
const checkIndexExists = require("./basicQueries/checkIndexExists");
module.exports = async function generateUniqueId() {
  let id = uuidv4();
  while (await checkIndexExists("user", id)) {
    id = uuidv4();
  }
  return id;
};
