import React, { useEffect, useState } from "react";
import { OPTIONS } from "../utils/constants";
import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";
import Header from "./Header";

const Favorite = () => {
  const [favorite, setFavorite] = useState([]);
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (savedFavorites) {
      setFavorite(savedFavorites);
    } else {
      fetchFavorite();
    }
  }, []);

  const fetchFavorite = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/account/${process.env.REACT_APP_ACCOUNT_ID}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`,
      OPTIONS
    );
    const json = await data.json();
    // console.log(json.results);
    setFavorite(json.results);

    localStorage.setItem("favorites", JSON.stringify(json.results));
  };
  const removeFromFavorite = (id) => {
    const updatedFavorite = favorite.filter((item) => item.id !== id);
    setFavorite(updatedFavorite);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorite));
  };
  return (
    <div className="bg-[#04152D] text-white">
      <div className="flex pb-14">
        <Header enableAuthentication={false} />
      </div>
      <div className="flex flex-wrap justify-center gap-10 p-10">
        {favorite.map((movie) => (
          <div className="flex flex-col">
            {/* <h1>{movie?.original_title}</h1> */}
            <MovieCard
              className="flex flex-wrap justify-center gap-10 p-1 m-2 md:p-5 md:m-5"
              key={movie.id}
              posterPath={movie?.poster_path}
              id={movie.id}
              rating={movie.vote_average.toFixed(1)}
              trimmedTitle={
                window.innerWidth < 768
                  ? movie.title.length > 5
                    ? movie.title.slice(0, 6) + "..."
                    : movie.title
                  : movie.title.length > 10
                  ? movie.title.slice(0, 15) + "..."
                  : movie.title
              }
              release_date={movie.release_date}
            />
            <div className="flex justify-center">
              
            <button className="px-5 pt-2 bg-red-700 rounded-md " onClick={() => removeFromFavorite(movie.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorite;
