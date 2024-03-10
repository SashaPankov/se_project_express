const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

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

const helmet = require("helmet");
const routes = require("./routes");

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(requestLogger);
app.use(routes);

process.on("uncaughtException", (err, origin) => {
  console.log(
    `${origin} ${err.name} with the message ${err.message} was not handled. Pay attention to it!`,
  );
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
