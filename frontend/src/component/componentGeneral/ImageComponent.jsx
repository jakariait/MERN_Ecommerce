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
      const imageUrl = `${apiUrl.replace('/api', '')}/uploads/${imageName}`;
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
