import React from "react";
import GptSearchBar from "./GptSearchBar";
import GptMovieSuggestions from "./GptMovieSuggestions";
import { BACKGROUND } from "../utils/constants";

const GPTSearch = () => {
  return (
    <>
      {" "}
      <div className="absolute -z-10">
        <img src={BACKGROUND} alt="background" />
      </div>
      <GptSearchBar />
      <GptMovieSuggestions />
    </>
  );
};

export default GPTSearch;
