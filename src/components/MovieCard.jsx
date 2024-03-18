import React, { useEffect, useState } from "react";
import {
  IMG_CDN,
  OPTIONS,
  addFav,
  addInToWatchList,
  favo,
  removeFromWatchList,
} from "../utils/constants";
import { Link } from "react-router-dom";
import CircleRating from "./circleRating/CircleRating";
import Rating from "./rating";

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
            addToFavorite();
          }}
          className="flex justify-around mx-auto text-4xl md:justify-center w-96"
        >
          {fav ? (
            <img
              className="absolute z-20 w-10"
              src={favo}
              alt="favorite icon"
            />
          ) : (
            <img
              className="absolute z-20 w-10 opacity-80"
              src="https://img.icons8.com/ios-filled/50/FFFFFF/heart-plus.png"
              alt="Add to favorites"
            />
          )}
        </button>
        <button
          onClick={() => {
            addToWatchList();
          }}
          className="flex justify-around mx-auto text-4xl md:justify-center w-96"
        >
          {watchList ? (
            <img
              className="absolute z-20 left-1 opacity-80"
              src="https://img.icons8.com/ios-filled/50/FFFFFF/remove-bookmark.png"
              alt="bookmark icon"
            />
          ) : (
            <img
              className="absolute z-20 left-1 opacity-80"
              src="https://img.icons8.com/ios-filled/50/FFFFFF/add-bookmark.png"
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
        <div className="absolute left-0 z-20 -mt-8">
          <CircleRating rating={rating} />
        </div>
        
      </Link>
        <div className="flex justify-between">
          <h2 className="mt-5 text-xl">{trimmedTitle}</h2>
          <span className=" group">
            <img
              className="w-10 "
              src="https://img.icons8.com/ios/50/737373/star--v1.png"
            />
            <div className="absolute hidden left-10 group-hover:flex bottom-10">
              {" "}
              <Rating />
            </div>
          </span>
        </div>
    </div>
  );
};

export default MovieCard;
