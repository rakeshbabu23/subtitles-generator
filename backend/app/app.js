require("dotenv").config();
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const cors = require("cors");
const { limiter } = require("../config/rateLimiter");
const uploadRoute = require("../routes/upload.route");

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

function createApp() {
  const app = express();
  app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: true }));
  app.use(compression());
  app.use(limiter);
  app.use(cors(corsOptions));

  app.use("/api", uploadRoute);
  return app;
}

module.exports = createApp;
