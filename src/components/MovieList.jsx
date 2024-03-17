import React from "react";
import MovieCard from "./MovieCard";

const MovieList = ({ title, movies }) => {
  return (
    <div className="mx-72">
      <h1 className="py-4 text-xl text-white md:text-3xl">{title}</h1>
      <div className="flex overflow-x-scroll md:h-[400px] scrollbar-hide">
        <div className="flex">
          {movies &&
            movies.map((movie) => (
              <div key={movie.id} className="flex text-white">
                <MovieCard
                  posterPath={movie.poster_path}
                  id={movie.id}
                  rating={movie.vote_average.toFixed(1)}
                  trimmedTitle={
                    movie.title.length > 10
                      ? movie.title.slice(0, 15) + "..."
                      : movie.title
                  } 
                  release_date={movie.release_date}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
