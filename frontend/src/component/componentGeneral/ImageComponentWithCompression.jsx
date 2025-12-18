import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";

const ImageComponentWithCompression = ({
  imageName,
  className = "",
  altName,
  skeletonHeight,
  width,
  height,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!imageName) {
    return null;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  let imageUrl = `${apiUrl.replace("/api", "")}/uploads/${imageName}`;

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

  return (
    <div className="relative overflow-hidden">
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10">
          <Skeleton height={skeletonHeight} width={"100%"} />
        </div>
      )}
      <img
        src={imageUrl}
        alt={altName || "Image"}
        className={`${className || "w-full h-auto"} transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default ImageComponentWithCompression;
