require("dotenv").config();
const createApp = require("./app/app");
const app = createApp();

// Start server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Error handling middleware

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Error handling for 404 not found

app.use((req, res) => {
  res.status(404).send("Page not found");
});
// require("dotenv").config();
// const express = require("express");
// const compression = require("compression");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { limiter } = require("./config/rateLimiter");
// const uploadRoute = require("./routes/upload.route");

// const corsOptions = {
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization", "Accept"],
// };

// function createApp() {
//   const app = express();
//   app.use(bodyParser.json());
//   app.use(bodyParser.urlencoded({ extended: true }));
//   app.use(compression());
//   app.use(limiter);
//   app.use(cors(corsOptions));

//   app.use("/api", uploadRoute);
//   return app;
// }

// const PORT = process.env.PORT || 3000;
// const app = createApp();
// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });
