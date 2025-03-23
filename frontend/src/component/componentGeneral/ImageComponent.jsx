import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import {CircularProgress} from "@mui/material";

const ImageComponent = ({ imageName, className = "", altName , skeletonHeight}) => {
  const [imageSrc, setImageSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageName) {
      setIsLoading(false);
      return;
    }

    const fetchImage = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [imageName]);
  return (
    <div>
      {isLoading ? (
        <Skeleton height={skeletonHeight} width={"100%"} />

      ) : (
        <img src={imageSrc} alt={altName} className={className} />
      )}
    </div>
  );
};

export default ImageComponent;
