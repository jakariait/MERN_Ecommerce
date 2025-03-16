import React, { useEffect, useState } from "react";
import axios from "axios";

const ImageComponent = ({ imageName, className = "" }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip if imageName is undefined or empty
    if (!imageName) {
      setIsLoading(false); // Stop loading if no imageName is provided
      return;
    }

    const fetchImage = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get(
          `http://localhost:5050/uploads/${imageName}`,
          { responseType: "blob" }
        );
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
      } catch (error) {
        setImageSrc(""); // Clear the image source on error
      } finally {
        setIsLoading(false); // Stop loading after fetch completes
      }
    };

    fetchImage();
  }, [imageName]); // Runs only when imageName changes

  return (
    <div>
      {isLoading ? (
        <p>Loading image...</p> // Show loading state
      ) : imageSrc ? (
        <img src={imageSrc} alt="Uploaded" className={className} /> // Show the image
      ) : (
        <p>No image available.</p> // Show a fallback message
      )}
    </div>
  );
};

export default ImageComponent;