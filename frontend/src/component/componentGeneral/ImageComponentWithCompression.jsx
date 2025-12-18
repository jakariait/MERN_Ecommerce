import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";

const ImageComponentWithCompression = ({
  imageName,
  className = "",
  altName,
  skeletonHeight,
  width,
  height,
  loadingStrategy = "lazy", // New prop: "lazy", "eager", or "auto"
  fetchPriority = "auto", // New prop: "high", "low", or "auto"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!imageName) {
    return null;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = `${apiUrl.replace("/api", "")}/uploads/${imageName}`;

  // Generate src for fallback or non-responsive images
  const defaultParams = new URLSearchParams();
  if (width) {
    defaultParams.append("width", width);
  }
  if (height) {
    defaultParams.append("height", height);
  }
  const defaultImageUrl = defaultParams.toString()
    ? `${baseUrl}?${defaultParams.toString()}`
    : baseUrl;

  const srcSet = undefined;
  let sizesAttribute = undefined;

  return (
    <div className="relative overflow-hidden">
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-10">
          <Skeleton height={skeletonHeight} width={"100%"} />
        </div>
      )}
      <img
        src={defaultImageUrl}
        srcSet={srcSet}
        sizes={sizesAttribute}
        alt={altName || "Image"}
        className={`${className || "w-full h-auto"} transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        loading={loadingStrategy}
        fetchPriority={fetchPriority}
        decoding="async"
      />
    </div>
  );
};

export default ImageComponentWithCompression;
