import React, { useEffect, useState } from "react";
import { IMG_CDN_ORG, OPTIONS } from "../utils/constants";

const Test = () => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetchImages();
  }, []);
  const fetchImages = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/1011985/images`,
      OPTIONS
    );
    const json = await data.json();
    console.log(json);
    setImages(json.backdrops);
  };
  const handleForward = () => {
    setImages((prev) => prev.slice(5));
  };
  const handleBackward = () => {
    setImages((prev) => {
      const length = prev.length;
      if (length > 5) {
        return prev.slice(0, 5);
      } else {
        return [];
      }
    });
  };
  return (
    <div>
      <div className="flex justify-between px-8">
        <h2 className="text-3xl ">Photos: </h2>
        <div className="flex">
          <img
            src="https://img.icons8.com/ios/50/circled-left-2.png"
            onClick={() => handleBackward()}
            alt=""
          />
          <img
            src="https://img.icons8.com/pastel-glyph/64/circled-chevron-right.png"
            onClick={() => handleForward()}
            alt=""
          />
        </div>
      </div>
      <div className="flex h-40 gap-2 overflow-x-scroll scrollbar-hide">
        {images.map((image, index) => (
          <img
            key={index}
            className="flex rounded-md"
            src={IMG_CDN_ORG + image?.file_path}
          />
        ))}
      </div>
    </div>
  );
};

export default Test;
