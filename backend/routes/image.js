const express = require("express");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");

const router = express.Router();

// Serve images from the 'uploads' folder with sharp compression
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

    // Determine the content type from the original file extension
    const ext = path.extname(filename).toLowerCase();

    // For non-image files, just stream them
    if (![".webp", ".jpeg", ".jpg", ".png"].includes(ext)) {
      return fs.createReadStream(inputPath).pipe(res);
    }

    // Create sharp transformer
    let transformer = sharp(inputPath);

    // Apply resize if dimensions provided
    if (width || height) {
      transformer = transformer.resize(width, height, {
        fit: "inside", // Maintains aspect ratio
        withoutEnlargement: true, // Prevents upscaling
      });
    }

    // Set content type and format
    if (ext === ".webp") {
      res.type("image/webp");
      transformer = transformer.webp({ quality: 80 });
    } else if (ext === ".jpeg" || ext === ".jpg") {
      res.type("image/jpeg");
      transformer = transformer.jpeg({ quality: 80 });
    } else if (ext === ".png") {
      res.type("image/png");
      transformer = transformer.png({ quality: 80, compressionLevel: 6 });
    }

    // Handle stream errors
    transformer.on("error", (err) => {
      console.error("Sharp error:", err);
      if (!res.headersSent) {
        res.status(500).send("Image processing error");
      }
    });

    // Pipe the transformed image to response
    transformer.pipe(res);
  } catch (err) {
    console.error("Route error:", err);
    if (!res.headersSent) {
      res.status(500).send("Server error");
    }
  }
});

module.exports = router;
