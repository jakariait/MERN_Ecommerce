const express = require("express");
const router = require("./routes/api");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");

let URL =
  "mongodb+srv://<username>:<password>@jakaria.kd2ej.mongodb.net/ClothingEcommerce?retryWrites=true&w=majority";
let option = { user: "jakariait", pass: "Jg0njUydl1srGwDE" };

mongoose
  .connect(URL, option)
  .then((res) => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const corsOptions = {
  origin: "*",  // Allow React app (adjust if different)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 200 });
app.use(limiter);

// ✅ Serve Uploaded Files (directly under /uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/", router);

module.exports = app;
