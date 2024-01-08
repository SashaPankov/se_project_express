const express = require("express");
const mongoose = require("mongoose");

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

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "65997b74fe2de9d1c49d3987",
  };
  next();
});
app.use(helmet());
app.use(routes);

process.on("uncaughtException", (err, origin) => {
  console.log(
    `${origin} ${err.name} with the message ${err.message} was not handled. Pay attention to it!`,
  );
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
