const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const endpointRouter = require("./routes/endpointRouter");
const authRouter = require("./routes/authRouter");
app.use(cors());
app.use(express.json({ limit: "50mb" }));
dotenv.config();

app.use("/endpoint", endpointRouter);
app.use("/auth", authRouter);

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`The server is running on port ${port}.`);
});
