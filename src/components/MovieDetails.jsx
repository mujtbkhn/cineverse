import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IMG_CDN, OPTIONS } from "../utils/constants";
import MovieCard from "./MovieCard";
import Accordion from "./Accordion";

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [details, setDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);

  useEffect(() => {
    fetchMovies();
    fetchDetails();
    fetchImages();
    fetchReviews();
    fetchSimilarMovies();
    fetchCast();
  }, [movieId]);

  const fetchMovies = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      OPTIONS
    );
    const json = await data.json();
    setMovieDetails(json);
    // console.log(movieId);
  };

  const fetchDetails = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      OPTIONS
    );
    const json = await data.json();
    // console.log(json);
    setDetails(json);
  };
  const fetchImages = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/images`,
      OPTIONS
    );
    const json = await data.json();
    // console.log(json);
    setImages(json.backdrops.slice(0, 7));
  };
  const fetchReviews = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/reviews`,
      OPTIONS
    );
    const json = await data.json();
    // console.log(json);
    setReviews(json);
  };
  const fetchSimilarMovies = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/similar`,
      OPTIONS
    );
    const json = await data.json();
    // console.log(json);
    setSimilar(json.results);
  };
  const fetchCast = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      OPTIONS
    );
    const json = await data.json();
    // console.log(json.cast);
    setCast(json.cast);
  };
  const fetchPersonDetails = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/${cast.original_name}`,
      OPTIONS
    );
    const json = await data.json();
    console.log(json);
  };

  const items = [
    {
      title: "Author : ",
      content: <div> {reviews?.results[0]?.author}</div>,
    },
    {
      title: "Review : ",
      content: <div> {reviews?.results[0]?.content}</div>,
    },
  ];

  if (!movieDetails) return <div>Loading...</div>;

  return (
    <div className="flex flex-col justify-center ">
      <div className="flex p-10">
        <div className="flex justify-center">
          <img
            className="object-contain w-screen m-5 h-3/4"
            src={IMG_CDN + movieDetails?.poster_path}
            alt={movieDetails?.title}
          />
        </div>
        <div>
          <h1 className="justify-center text-2xl font-bold">
            {movieDetails?.title}
          </h1>
          <h1 className="text-xl italic font-semibold">{details?.tagline}</h1>

          <h3>{movieDetails?.overview}</h3>
          <h2>Release Date: {movieDetails?.release_date}</h2>
          <h2>Rating: {movieDetails?.vote_average}</h2>
          <h2>Cast: </h2>
          <div className="flex flex-wrap justify-center gap-10">
            {cast
              ?.map((cast) => (
                <div className="flex flex-col flex-wrap">
                  <Link to={"/person"}>
                    <img className="w-28 " src={IMG_CDN + cast?.profile_path} />
                  </Link>
                  <h1 className="font-bold">{cast?.original_name}</h1>
                  <h2>{cast?.character}</h2>
                </div>
              ))
              .slice(0, 8)}
          </div>
        </div>
      </div>
      <div>
        <Accordion items={items} />
      </div>
      {/* <h2>Vote count: {movieDetails?.vote_count}</h2> */}
      {/* <h3>Author: {reviews?.results[0]?.author}</h3>
      <h3>Review: {reviews?.results[0]?.content}</h3> */}
      {/* <img className="object-contain w-48 h-48" src={IMG_CDN + details?.backdrop_path}/> */}
      {/* <img className="object-contain w-48 h-48" src={IMG_CDN + details?.belongs_to_collection?.backdrop_path} /> */}
      <div className="flex flex-wrap justify-center gap-10 pb-5">
        {images.map((image) => (
          <img
            className="flex flex-col object-contain w-96"
            src={IMG_CDN + image?.file_path}
          />
        ))}
      </div>
      <h1 className="p-4 text-3xl font-bold ">Similar Movies:</h1>
      <div className="flex flex-wrap justify-center gap-10 ">
        {similar.map((movie) => (
          <MovieCard
            className="p-5 m-5"
            key={movie.id}
            posterPath={movie?.poster_path}
            id={movie.id}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieDetails;
