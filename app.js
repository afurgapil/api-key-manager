const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const endpointRouter = require("./routes/endpointRouter");
const authRouter = require("./routes/authRouter");
const requestRouter = require("./routes/requestRouter");
const logRouter = require("./routes/logRouter");
const contactRouter = require("./routes/contactRouter");
app.use(cors());
app.use(express.json({ limit: "50mb" }));
dotenv.config();

app.use("/endpoint", endpointRouter);
app.use("/auth", authRouter);
app.use("/request", requestRouter);
app.use("/log", logRouter);
app.use("/contact", contactRouter);

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`The server is running on port ${port}.`);
});
