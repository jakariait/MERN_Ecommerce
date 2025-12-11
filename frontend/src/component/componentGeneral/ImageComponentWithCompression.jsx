import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import axios from "axios";

const ImageComponentWithCompression = ({
  imageName,
  className = "",
  altName,
  skeletonHeight,
  width,
  height,
}) => {
  const [imageSrc, setImageSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let objectUrl;
    if (imageName) {
      const apiUrl = import.meta.env.VITE_API_URL;
      let imageUrl = `${apiUrl}/image/${imageName}`; // Using the user's preferred URL structure

      const params = new URLSearchParams();
      if (width) {
        params.append("width", width);
      }
      if (height) {
        params.append("height", height);
      }

      if (params.toString()) {
        imageUrl += `?${params.toString()}`;
      }

      setIsLoading(true); // Ensure loading state is true before fetch
      axios
        .get(imageUrl, { responseType: "blob" })
        .then((response) => {
          objectUrl = URL.createObjectURL(response.data);
          setImageSrc(objectUrl);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
          setIsLoading(false);
          setImageSrc(""); // Clear image on error
        });
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageName, width, height]);

  return (
    <div>
      {isLoading && <Skeleton height={skeletonHeight} width={"100%"} />}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={altName}
          className={className}
          style={{ display: isLoading ? "none" : "block" }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setImageSrc(""); // Clear image on error
          }}
        />
      )}
    </div>
  );
};

export default ImageComponentWithCompression;
