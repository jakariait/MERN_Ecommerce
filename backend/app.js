require("dotenv").config(); // Load environment variables

const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const compression = require("compression");
const { xss } = require("express-xss-sanitizer");
const mongoSanitize = require("./middlewares/mongoSanitize");

// Routes
const router = require("./routes/api");
const imageMiddleware = require("./middlewares/imageMiddleware");

const app = express();

// ---------------------------
// Security Headers Configuration
// ---------------------------
const securityHeaders = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
      connectSrc: ["'self'", "https://www.google-analytics.com", "https://analytics.google.com"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  crossOriginOpenerPolicy: {
    policy: "same-origin",
  },
  crossOriginResourcePolicy: {
    policy: "same-origin",
  },
  XFrameOptions: "DENY",
  XContentTypeOptions: "nosniff",
  ReferrerPolicy: "strict-origin-when-cross-origin",
  PermissionsPolicy: {
    geolocation: [],
    microphone: [],
    camera: [],
  },
};

// ---------------------------
// MongoDB Connection
// ---------------------------
const URL = process.env.MONGO_URI;
if (!URL || !process.env.CLIENT_URL) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

mongoose
  .connect(URL, { autoIndex: true })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

// ---------------------------
// CORS Configuration
// ---------------------------
const clientUrl = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.replace(/\/$/, ""))
  : [];

const corsOptions = {
  origin: clientUrl,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Favicon"],
};

// ---------------------------
// Security Middlewares
// ---------------------------

// Trust proxy (needed for rate limiting behind proxies)
app.set("trust proxy", 1);


// Apply Sharp middleware BEFORE static serving
app.use("/uploads", imageMiddleware);


// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve robots.txt
app.use(express.static(path.join(__dirname, ".")));


// Compression
app.use(compression());

// Cookie parser
app.use(cookieParser());

// Enable CORS
app.use(cors(corsOptions));

// Sanitize MongoDB queries to prevent NoSQL injection
app.use(mongoSanitize);

// Set secure HTTP headers
app.use(helmet(securityHeaders));

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Sanitize user input to prevent XSS attacks
app.use(xss());

// ---------------------------
// Body Parsers
// ---------------------------
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ---------------------------
// Rate Limiting
// ---------------------------
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2000, // limit each IP
});
app.use(limiter);

// ---------------------------
// Routes
// ---------------------------
app.use("/api/", router);

module.exports = app;
