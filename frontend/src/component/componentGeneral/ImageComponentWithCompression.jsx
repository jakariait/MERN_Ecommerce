import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";

const ImageComponentWithCompression = ({
  imageName,
  className = "",
  altName,
  skeletonHeight,
  width,
  height,
  responsive = true,
  imageSizes = [480, 768, 1024, 1440], // Default sizes for srcset
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
  const defaultImageUrl = defaultParams.toString() ? `${baseUrl}?${defaultParams.toString()}` : baseUrl;

  // Generate srcset if responsive is true
  const srcSet = responsive
    ? imageSizes
        .map((size) => {
          const params = new URLSearchParams();
          params.append("width", size);
          // Optionally add height if aspect ratio needs to be maintained differently
          // For now, assuming backend handles aspect ratio with just width
          return `${baseUrl}?${params.toString()} ${size}w`;
        })
        .join(", ")
    : undefined;

  const sizes = responsive ? "100vw" : undefined; // Simple sizes for now, can be made dynamic via prop

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
        sizes={sizes}
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
