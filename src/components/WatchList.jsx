import React, { useEffect, useState } from "react";
import { OPTIONS } from "../utils/constants";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";
import Header from "./Header";

const WatchList = () => {
  const [watchList, setWatchList] = useState([]);
  useEffect(() => {
    const savedWatchList = JSON.parse(localStorage.getItem("WatchList"));
    if (savedWatchList) {
      setWatchList(savedWatchList);
    } else {
      fetchWatchList();
    }
  }, []);

  const fetchWatchList = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/account/${process.env.REACT_APP_ACCOUNT_ID}/watchlist/movies?language=en-US&page=1&sort_by=created_at.asc`,
      OPTIONS
    );
    const json = await data.json();
    // console.log(json.results);
    setWatchList(json.results);
    localStorage.setItem("WatchList", JSON.stringify(json.results));
  };
  const removeFromWatchList = (id) => {
    const updatedWatchList = watchList.filter((item) => item.id !== id);
    setWatchList(updatedWatchList);
    localStorage.setItem("WatchList", JSON.stringify(updatedWatchList));
  };
  return (
    <>
      <Header enableAuthentication={false} />

      <div className="flex justify-center">
        <button className="px-2 py-2 m-2 text-white bg-red-700 rounded-md md:px-5">
          <Link to={"/favorite"}> Favorites</Link>
        </button>
        <button className="px-2 py-2 m-2 text-white bg-black rounded-md md:px-5">
          <Link to={"/watchlist"}> WatchList</Link>
        </button>
      </div>
      <div className="flex flex-wrap justify-center gap-10 p-10">
        {watchList.map((movie) => (
          <div>
            <h1>{movie?.original_title}</h1>
            <MovieCard
              className="flex flex-wrap justify-center gap-10 p-1 m-2 md:p-5 md:m-5"
              key={movie.id}
              posterPath={movie?.poster_path}
              id={movie.id}
            />
            <button onClick={() => removeFromWatchList(movie.id)}>
              watched?
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default WatchList;
