import React, { useEffect, useState } from "react";
import {
  IMG_CDN,
  OPTIONS,
} from "../utils/constants";
import { Link } from "react-router-dom";
import Rating from "./MainContainer/rating";

const MovieCard = ({ id, posterPath, rating, trimmedTitle, release_date }) => {
  const [details, setDetails] = useState(null);
  const [watchList, setWatchList] = useState(false);
  const [fav, setFav] = useState(false);
  useEffect(() => {
    fetchDetails();
    try {
      const favoritesFromStorage = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );
      const isFavorite = favoritesFromStorage.some(
        (movie) => movie?.id === parseInt(id)
      );
      setFav(isFavorite);
    } catch (error) {
      console.error("Error parsing favorites from localStorage:", error);
      setFav(false);
    }
    try {
      const watchListsFromStorage = JSON.parse(
        localStorage.getItem("WatchList") || "[]"
      );
      const isWatchList = watchListsFromStorage.some(
        (movie) => movie?.id === parseInt(id)
      );
      setWatchList(isWatchList);
    } catch (error) {
      console.error("Error parsing favorites from localStorage:", error);
      setWatchList(false);
    }
  }, [id]);
  const fetchDetails = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${id}`,
      OPTIONS
    );
    const json = await data.json();
    setDetails(json);
  };

  const addToFavorite = () => {
    const url = `https://api.themoviedb.org/3/account/${process.env.REACT_APP_ACCOUNT_ID}/favorite`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: "Bearer " + process.env.REACT_APP_TMDB_KEY,
      },
      body: JSON.stringify({
        media_type: "movie",
        media_id: id,
        favorite: true,
      }),
    };

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add to watchlist");
        }
        return res.json();
      })
      .then((json) => {
        setFav(true);

        const existingFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];
        const updatedFavorites = [...existingFavorites, details];
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setFav(true);
      })
      .catch((err) => console.error("error:" + err));
  };

  const addToWatchList = () => {
    const url = `https://api.themoviedb.org/3/account/${process.env.REACT_APP_ACCOUNT_ID}/watchlist`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: "Bearer " + process.env.REACT_APP_TMDB_KEY,
      },
      body: JSON.stringify({
        media_type: "movie",
        media_id: id,
        watchlist: true,
      }),
    };

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add to watchlist");
        }
        return res.json();
      })
      .then((json) => {
        setWatchList(true);

        const existingWatchLists =
          JSON.parse(localStorage.getItem("WatchList")) || [];
        const updatedWatchLists = [...existingWatchLists, details];
        localStorage.setItem("WatchList", JSON.stringify(updatedWatchLists));
        setWatchList(true);
      })
      .catch((err) => console.error("error:" + err));
  };

  if (!posterPath) return null;
  return (
    <div className="relative z-10 w-32 pr-6 rounded-md md:w-60">
      <span>
        <button
          onClick={() => {
            addToWatchList();
          }}
          className="flex justify-around mx-auto text-4xl md:justify-center w-96"
        >
          {watchList ? (
            <img
              className="absolute left-0 z-20 opacity-80"
              src="https://img.icons8.com/fluency/48/bookmark-ribbon.png"
              alt="bookmark icon"
            />
          ) : (
            <img
              className="absolute left-0 z-20 opacity-80"
              src="https://img.icons8.com/fluency/48/add-bookmark.png"
              alt="add-bookmark"
            />
          )}
        </button>
      </span>
      <Link to={`/movieDetails/${id}`}>
        <img
          alt="movie card"
          className="relative rounded-md"
          src={IMG_CDN + posterPath}
        />
        <div className="absolute left-0 z-20 -mt-12">
        </div>
      </Link>
      <h2 className="mt-1 text-xl">{trimmedTitle}</h2>
      <div className="flex justify-between mt-2">
        <div className="flex">
          <img
            className="object-contain w-6 "
            src="https://img.icons8.com/fluency/48/star--v1.png"
            alt="star--v1"
          />
          <h2 className="text-xl">{rating}</h2>
        </div>
        <span className=" group">
          <img
            className="w-7"
            src="https://img.icons8.com/ios/50/737373/star--v1.png"
          />
          <div className="absolute hidden left-10 group-hover:flex bottom-12">
            {" "}
            <Rating />
          </div>
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
