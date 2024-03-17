import React from "react";
import { IMG_CDN } from "../utils/constants";
import { Link } from "react-router-dom";
import CircleRating from "./circleRating/CircleRating";

const MovieCard = ({ id, posterPath, rating, trimmedTitle, release_date }) => {
  if (!posterPath) return null;
  return (
    <div className="relative z-10 w-32 pr-6 rounded-md md:w-60">
      <Link to={`/movieDetails/${id}`}>
        <img
          alt="movie card"
          className="rounded-md"
          src={IMG_CDN + posterPath}
        />
        <div className="absolute left-0 z-20 -mt-8">
          <CircleRating rating={rating} />
        </div>
        <h2 className="mt-5 text-xl">{trimmedTitle}</h2>
        <p className="text-sm">{release_date}</p>
      </Link>
    </div>
  );
};

export default MovieCard;
