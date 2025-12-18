// middleware/imageMiddleware.js
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "../uploads");
const cacheDir = path.join(__dirname, "../cache/images");

// Ensure cache directory exists
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

const imageMiddleware = async (req, res, next) => {
  try {
    const filename = req.path.substring(1); // Remove leading '/'
    const width = parseInt(req.query.width) || null;
    const height = parseInt(req.query.height) || null;

    const inputPath = path.join(uploadsDir, filename);
    const ext = path.extname(filename).toLowerCase();

    // If file doesn't exist or not an image, let static middleware handle it
    if (!fs.existsSync(inputPath) || ![".webp", ".jpeg", ".jpg", ".png"].includes(ext)) {
      return next();
    }

    // Generate cache filename
    const baseFilename = path.parse(filename).name;
    const sizeSuffix = width || height ? `-${width || "auto"}x${height || "auto"}` : "";
    const cacheFilename = `${baseFilename}${sizeSuffix}${ext}`;
    const cachePath = path.join(cacheDir, cacheFilename);

    // Set headers
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.type(ext.substring(1));

    // Serve from cache if exists
    if (fs.existsSync(cachePath)) {
      console.log("✓ Serving from cache:", cacheFilename);
      return fs.createReadStream(cachePath).pipe(res);
    }

    console.log("⚙ Processing image:", filename);

    // Process with Sharp
    let transformer = sharp(inputPath);

    if (width || height) {
      transformer = transformer.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Apply compression
    if (ext === ".webp") {
      transformer = transformer.webp({ quality: 85, effort: 6 });
    } else if (ext === ".jpeg" || ext === ".jpg") {
      transformer = transformer.jpeg({ quality: 85, progressive: true });
    } else if (ext === ".png") {
      transformer = transformer.png({ quality: 85, compressionLevel: 9 });
    }

    // Save to cache
    await transformer.toFile(cachePath);
    console.log("✓ Cached to:", cachePath);

    // Serve the processed file
    fs.createReadStream(cachePath).pipe(res);

  } catch (err) {
    console.error("❌ Image processing error:", err);
    if (!res.headersSent) {
      res.status(500).send("Server error: " + err.message);
    }
  }
};

module.exports = imageMiddleware;