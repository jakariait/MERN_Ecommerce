import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";

const ImageComponent = ({
  imageName,
  className = "",
  altName,
  skeletonHeight,
}) => {
  const [imageSrc, setImageSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageName) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const imageUrl = `${apiUrl.replace("/api", "")}/uploads/${imageName}`;
      setImageSrc(imageUrl);
    } else {
      setImageSrc("");
    }
    setIsLoading(true);
  }, [imageName]);

  return (
    <div
      style={{
        position: "relative",
        height: skeletonHeight,
        width: "100%",
        display: "inline-block",
      }}
    >
      {isLoading && (
        <Skeleton
          height={skeletonHeight}
          width={"100%"}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={altName}
          className={className}
          loading="lazy"
          decoding="async"
          style={{
            opacity: isLoading ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
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

export default ImageComponent;
