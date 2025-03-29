import React, { useState, useEffect } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import ImageComponent from "./ImageComponent.jsx";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { BsArrowsFullscreen } from "react-icons/bs";

const ProductGallery = ({ images, discount }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // Track active image

  useEffect(() => {
    if (images?.length > 0) {
      const urls = images.map(
        (imageName) => `http://localhost:5050/uploads/${imageName}`,
      );
      setImageUrls(urls);
    }
  }, [images]);

  // Function to handle next and previous image
  const changeImage = (direction) => {
    setActiveIndex((prevIndex) => {
      if (direction === "next") {
        return prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1;
      }
    });
  };

  if (imageUrls.length === 0) return <p>Loading images...</p>;

  return (
    <div className="flex flex-col items-center">
      {/* Main Image with LightGallery */}
      <div className="relative w-full md:p-3">
        {discount && (
          <span className="absolute md:top-3 md:left-3 bg-red-400 px-3 py-1 text-white">
            -{discount}%
          </span>
        )}

        <div
          className={
            "absolute bottom-1 right-1 md:bottom-4 flex md:right-4 z-10 gap-1"
          }
        >
          <button
            className={"bg-white p-2 cursor-pointer"}
            onClick={() => changeImage("prev")}
            disabled={activeIndex === 0}
          >
            <IoIosArrowBack />
          </button>
          <button
            className={"bg-white p-2 cursor-pointer"}
            onClick={() => changeImage("next")}
            disabled={activeIndex === imageUrls.length - 1}
          >
            <IoIosArrowForward />
          </button>
        </div>

        <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
          {imageUrls.map((url, index) => (
            <a
              key={index}
              href={url}
              className={activeIndex === index ? "block" : "hidden"}
            >
              <ImageComponent
                imageName={images[index]}
                alt="Main Image"
                className="w-full h-auto object-cover cursor-pointer"
              />
              <button
                className={
                  "absolute md:bottom-4 bottom-1 left-1 p-3 md:left-3 bg-white rounded-full cursor-pointer"
                }
              >
                <BsArrowsFullscreen />
              </button>
            </a>
          ))}
        </LightGallery>
      </div>

      <div className="flex items-center gap-2 w-full justify-center">
        {/* Left Arrow */}
        <button
          onClick={() => changeImage("prev")}
          className="text-xl hover:text-gray-500 transition-colors duration-150 cursor-pointer"
          disabled={activeIndex === 0}
        >
          <IoIosArrowBack />
        </button>

        {/* Thumbnail Container */}
        <div className=" p-2 flex items-center gap-4 overflow-hidden w-[calc(40rem)]">
          {" "}
          {/* 4 thumbnails * 10rem each + gaps */}
          <div
            className="flex gap-4 transition-transform duration-300"
            style={{
              transform: `translateX(-${Math.min(Math.floor(activeIndex / 4) * 4, imageUrls.length - 4) * 11}rem)`,
            }}
          >
            {imageUrls.map((imgUrl, index) => (
              <div
                key={index}
                className={`cursor-pointer overflow-hidden transition-all duration-200 border-1 shrink-0 md:w-30 md:h-30 w-20 h-20 ${
                  activeIndex === index
                    ? "border-blue-500 scale-105"
                    : "border-transparent opacity-80"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <ImageComponent
                  imageName={images[index]}
                  alt={`Thumbnail ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => changeImage("next")}
          className="text-xl hover:text-gray-500 transition-colors duration-150 cursor-pointer"
          disabled={activeIndex === imageUrls.length - 1}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default ProductGallery;
