import React from "react";
import GptSearchBar from "./GptSearchBar";
import GptMovieSuggestions from "./GptMovieSuggestions";
import { BACKGROUND } from "../utils/constants";

const GPTSearch = () => {
  return (
    <>
      <div className="fixed no-scrollbar -z-10">
        <img className="object-cover h-screen md:object-none md:w-screen" src={BACKGROUND} alt="background" />
      </div>
      <div className="block">
        <GptSearchBar />
        <GptMovieSuggestions />
      </div>
    </>
  );
};

export default GPTSearch;
