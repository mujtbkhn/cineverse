import React, { useEffect, useState } from "react";
import { IMG_CDN, OPTIONS } from "../utils/constants";
import MovieCard from "./MovieCard";

const WatchList = () => {
  const [watchList, setWatchList] = useState([]);
  useEffect(() => {
    fetchWatchList();
  }, []);

  const fetchWatchList = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/account/20915650/watchlist/movies?language=en-US&page=1&sort_by=created_at.asc",
      OPTIONS
    );
    const json = await data.json();
    console.log(json.results);
    setWatchList(json.results);
  };
  return (
    <div>
      <h1>{watchList[0]?.original_title}</h1>
      {watchList.map((movie) => (
          <MovieCard
            className="flex flex-wrap justify-center gap-10 p-1 m-2 md:p-5 md:m-5"
            key={movie.id}
            posterPath={movie?.poster_path}
            id={movie.id}
          />
        ))}
    </div>
  );
};

export default WatchList;
