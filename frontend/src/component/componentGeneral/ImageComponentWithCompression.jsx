import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

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
    if (imageName) {
      const apiUrl = import.meta.env.VITE_API_URL;
      let imageUrl = `${apiUrl.replace("/api", "")}/image/${imageName}`;

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

      setImageSrc(imageUrl);
    }
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
            setImageSrc(""); // or keep blank
          }}
        />
      )}
    </div>
  );
};

export default ImageComponentWithCompression;
