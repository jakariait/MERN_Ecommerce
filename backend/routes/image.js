const express = require("express");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

const router = express.Router();

const cacheDir = path.join(__dirname, "../cache/images");

// Function to ensure cache directory exists
const ensureCacheDir = () => {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
};

// Ensure cache directory exists on startup
ensureCacheDir();

// Serve images from the 'uploads' folder with sharp compression and caching
// ?width=329&height=329
router.get("/image/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const width = parseInt(req.query.width) || null;
    const height = parseInt(req.query.height) || null;

    const inputPath = path.join(__dirname, "../uploads", filename);

    if (!fs.existsSync(inputPath)) {
      return res.status(404).send("Image not found");
    }

    // Set client-side caching headers
    res.set("Cache-Control", "public, max-age=31536000, immutable");

    const ext = path.extname(filename).toLowerCase();

    // For non-image files, just stream them without caching
    if (![".webp", ".jpeg", ".jpg", ".png"].includes(ext)) {
      return fs.createReadStream(inputPath).pipe(res);
    }

    // Generate a unique cache filename
    const baseFilename = path.parse(filename).name;
    const sizeSuffix =
      width || height ? `-${width || "auto"}x${height || "auto"}` : "";
    // Keep the original extension to determine content-type
    const cacheFilename = `${baseFilename}${sizeSuffix}${ext}`;
    const cachePath = path.join(cacheDir, cacheFilename);

    // If cached file exists, serve it
    if (fs.existsSync(cachePath)) {
      res.type(ext.substring(1)); // e.g., 'jpeg', 'png'
      return fs.createReadStream(cachePath).pipe(res);
    }

    // --- If not cached, process the image ---

    let transformer = sharp(inputPath);

    if (width || height) {
      transformer = transformer.resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Set content type and format options
    res.type(ext.substring(1));
    if (ext === ".webp") {
      transformer = transformer.webp({ quality: 100 });
    } else if (ext === ".jpeg" || ext === ".jpg") {
      transformer = transformer.jpeg({ quality: 100 });
    } else if (ext === ".png") {
      transformer = transformer.png({ quality: 100, compressionLevel: 6 });
    }


    // Save the processed image to the cache
    await transformer.toFile(cachePath);

    // Stream the newly cached file to the response
    fs.createReadStream(cachePath).pipe(res);
  } catch (err) {
    console.error("Route error:", err);
    if (!res.headersSent) {
      res.status(500).send("Server error");
    }
  }
});

module.exports = router;