const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const pool = require("./utils/settings/usePool");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
app.use(cors());
app.use(express.json({ limit: "50mb" }));
dotenv.config();

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.get("/ping", (req, res) => {
  const connectionCount = pool._allConnections.length;

  const response = {
    message: "Pong",
    serverTime: new Date().toISOString(),
    connectionCount,
  };

  res.status(200).json(response);
});

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`The server is running on port ${port}.`);
});
