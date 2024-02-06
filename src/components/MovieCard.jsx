import React from "react";
import { IMG_CDN } from "../utils/constants";
import { Link } from "react-router-dom";

const MovieCard = ({ id, posterPath }) => {
  if(!posterPath) return null;
  return (
    <div className="w-40 pr-6 md:w-48">
      <Link to={`/movieDetails/${id}`}><img alt="movie card" src={IMG_CDN + posterPath} /></Link>
    </div>
  );
};

export default MovieCard;
