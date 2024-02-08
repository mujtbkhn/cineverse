import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  const [personId, setPersonId] = useState(null);

  
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
    // console.log(json);
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

  const fetchPerson = async (personName) => {
    const encodedPersonName = encodeURIComponent(personName); // Encode the person name
    const data = await fetch(
      `https://api.themoviedb.org/3/search/person?query=${encodedPersonName}&include_adult=false&language=en-US&page=1`,
      OPTIONS
    );
    const json = await data.json();
    const id = json.results[0]?.id;
    setPersonId(id);
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
    <div className="flex-col justify-center md:flex ">
      <div className="p-5 md:p-10 md:flex">
        <div className="justify-center md:flex">
          <img
            className="object-contain w-screen m-5 h-3/4"
            src={IMG_CDN + movieDetails?.poster_path}
            alt={movieDetails?.title}
          />
        </div>
        <div className="flex flex-col gap-2 m-4 md:m-10">
          <h1 className="justify-center text-2xl font-bold">
            {movieDetails?.title}
          </h1>
          <h1 className="text-xl italic font-semibold">{details?.tagline}</h1>

          <h3>{movieDetails?.overview}</h3>
          <h2>
            Release Date:{" "}
            <div className="inline font-bold">{movieDetails?.release_date}</div>
          </h2>
          <h2>Rating: {movieDetails?.vote_average}</h2>
          <h2 className="p-2 text-3xl ">Cast: </h2>
          <div className="flex flex-wrap justify-center gap-10 ">
            {cast
              ?.map((cast) => (
                <div className="flex flex-col flex-wrap" key={cast.id}>
                  <Link to={personId ? `/person/${personId}` : "#"}>
                    {cast.profile_path ? (
                      <img
                        onClick={() => fetchPerson(cast?.original_name)}
                        className="w-20 md:w-28"
                        src={IMG_CDN + cast?.profile_path}
                      />
                    ) : null}
                  </Link>
                  <h1 className="font-bold">
                    {cast?.original_name.slice(0, 15) + "..."}
                  </h1>
                  <h2>{cast?.character.slice(0, 15) + "..."}</h2>
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
      <div className="flex flex-wrap justify-center gap-10 md:flex-row md:justify-center ">
        {similar.map((movie) => (
          <MovieCard
            className="flex flex-wrap justify-center gap-10 p-1 m-2 md:p-5 md:m-5"
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
