const app = require("../app");

const port = process.env.PORT || 8001;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = server;
