import React, { useEffect, useState } from "react";
import { OPTIONS } from "../utils/constants";
import MovieCard from "./MovieCard";

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

    localStorage.setItem('favorites', JSON.stringify(json.results))
  };
  const removeFromFavorite = (id) => {
    const updatedFavorite = favorite.filter((item) => item.id !== id);
    setFavorite(updatedFavorite);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorite))

  };
  return (
    <div className="flex flex-wrap justify-center gap-10 p-10">
      {favorite.map((movie) => (
        <div>
          <h1>{movie?.original_title}</h1>
          <MovieCard
            className="flex flex-wrap justify-center gap-10 p-1 m-2 md:p-5 md:m-5"
            key={movie.id}
            posterPath={movie?.poster_path}
            id={movie.id}
          />
          <button onClick={() => removeFromFavorite(movie.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default Favorite;
