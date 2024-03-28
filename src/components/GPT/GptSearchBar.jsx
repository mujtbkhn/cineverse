import React, { useRef } from "react";
import lang from "../../utils/langConstants";
import { useDispatch, useSelector } from "react-redux";
import openai from "../../utils/openai";
import { OPTIONS } from "../../utils/constants";
import { addGptMovieResult } from "../../utils/gptSlice";

const GptSearchBar = () => {
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);
  const dispatch = useDispatch();

  const searchMovieTMDB = async (movie) => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        movie
      )}&include_adult=false&language=en-US&page=1`,
      OPTIONS
    );
    const json = await data.json();
    return json.results;
  };

  const handleGptSearchClick = async () => {
    const gptQuery =
      "Act as a movie recommendation system and provide movies results based on this query: " +
      searchText.current.value +
      ". only give me names of 5 movies, comma separated like the example result, example result: jawaan, pathan, dunki, tiger3, animal";

    const gptResults = await openai.chat.completions.create({
      messages: [{ role: "user", content: gptQuery }],
      model: "gpt-3.5-turbo",
    });

    if (!gptResults.choices) {
      return;
    }

    const gptMovies = gptResults.choices?.[0]?.message?.content.split(",");
    console.log(gptMovies);

    //mapping for each movie to be fetched from tmdb api
    const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));

    const tmdbResults = await Promise.all(promiseArray);
    console.log(tmdbResults);

    dispatch(
      addGptMovieResult({ movieNames: gptMovies, movieResults: tmdbResults })
    );
  };

  return (
    <div className="md:pt-[10%] pt-[65%] flex justify-center">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-12 m-2 bg-black rounded-md md:m-4 md:w-1/2"
      >
        <input
          ref={searchText}
          type="text"
          className="col-span-9 p-2 m-4 rounded-md md:p-4"
          placeholder={lang[langKey].placeholder}
        />
        <button
          className="col-span-3 px-3 py-2 m-4 text-white bg-red-700 rounded-lg md:px-4"
          onClick={handleGptSearchClick}
        >
          {lang[langKey].search}
        </button>
      </form>
    </div>
  );
  //here we pass in langKey in array format because lang doesn't know what langKey is
};

export default GptSearchBar;
