import React from "react";
import Header from "./Header";
import useNowPlayingMovies from "../hooks/useNowPlaying";
import MainContainer from "./MainContainer";
import SecondaryContainer from "./SecondaryContainer";
import usePopularMovies from "../hooks/usePopularMovies";
import useTopRatedMovies from "../hooks/useTopRatedMovies";
import useUpcomingMovies from "../hooks/useUpcomingMovies";
import GPTSearch from "./GPTSearch";
import { useSelector } from "react-redux";

const Browse = () => {
  //these are called to update the store so whenever i fetch from SecondaryContainer i get the updated movies lists
  useNowPlayingMovies();
  usePopularMovies();
  useTopRatedMovies();
  useUpcomingMovies();

  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  return (
      <div className="overflow-y-scroll scrollbar-hide">
        <Header />
        {showGptSearch ? (
          <GPTSearch />
        ) : (
          <>
            {" "}
            <MainContainer />
            <SecondaryContainer />{" "}
          </>
        )}
      </div>
  );
};

export default Browse;
