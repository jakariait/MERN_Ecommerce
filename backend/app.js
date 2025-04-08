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
const ProductModel = require("./models/ProductModel"); // or your path

require("dotenv").config(); // ✅ Load environment variables

const URL = process.env.MONGO_URI; // ✅ Use environment variable

mongoose
  .connect(URL, {
    autoIndex: true, // Optionally keep this if you need auto-indexing
  })
  .then(async () => {
    console.log("Database Connected");
  })
  .catch((err) => console.log("DB Connection Error:", err));

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Favicon"], // Expose required headers
};

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 2000 });
app.use(limiter);

app.use("/api/", router);

module.exports = app;
