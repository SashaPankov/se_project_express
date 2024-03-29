const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const helmet = require("helmet");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();
const { reqLimiter } = require("./middlewares/limiter");

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("Connected to DB");
  },
  (e) => {
    console.log("DB error", e);
  },
);

const routes = require("./routes");

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use(routes);

process.on("uncaughtException", (err, origin) => {
  console.log(
    `${origin} ${err.name} with the message ${err.message} was not handled. Pay attention to it!`,
  );
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.use(reqLimiter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
