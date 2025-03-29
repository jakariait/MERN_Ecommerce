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
      // Directly set the image URL when the imageName is available
      const imageUrl = `http://localhost:5050/uploads/${imageName}`;
      setImageSrc(imageUrl);
      setIsLoading(false);
    }
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
