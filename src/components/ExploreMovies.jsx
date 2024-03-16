import React, { useEffect, useState } from "react";
import { OPTIONS } from "../utils/constants";
import MovieCard from "./MovieCard";
import Header from "./Header";

const ExploreMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  useEffect(() => {
    fetchMovies();
  }, []);
  

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/discover/movie?page=${page}`,
        OPTIONS
      );
      const json = await data.json();
      console.log(json.results);
      setMovies((prevMovies) => [...prevMovies, ...json.results]);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    } catch (error) {
      setError(error);
      console.log("error occurred while fetching: ", error);
    }
  };

  const handleScroll = () => {
    const threshold = 100;
    const scrolledToBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.offsetHeight - threshold;
    if (scrolledToBottom && !loading) {
      fetchMovies();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <>
    <div>
      <Header enableAuthentication={false} />
    </div>
      <div className="flex justify-center text-3xl align-middle">
        Explore Movies From TMDB API
      </div>
      <div className="flex flex-wrap justify-center gap-10 md:flex-row md:justify-center ">
        {movies?.map((movie) => (
          <MovieCard
            className="flex flex-wrap justify-center gap-10 p-1 m-2 md:p-5 md:m-5"
            key={movie.id}
            posterPath={movie?.poster_path}
            id={movie.id}
          />
        ))}
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
      </div>
    </>
  );
};

export default ExploreMovies;
