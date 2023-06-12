const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

//1) MIDDLEWARE
if (process.env.NODE_ENV.trim() === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.json());
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
