import { useEffect, useState } from "react";
import ImageAmbilight from "../utils/Ambilight/ImageAmbilight";
import "./Test.css";
const Test = () => {
  const [movieDetails, setMovieDetails] = useState("");
  useEffect(() => {
    fetchMovies();
  }, []);
  const IMG_CDN_ORG = "https://image.tmdb.org/t/p/original";

  const REACT_APP_TMDB_KEY =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjNlMmRiMjA5Y2UwMjY5MDRmZjMzYWJkMWM1NTU3OCIsInN1YiI6IjY1OWZhMTFmOTA3ZjI2MDEyMjIwZTA2MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nZ8TO-EaAryQd4nbVT2-SfINk8RC4lUTsX8vP1q4j1Q";
  const OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + REACT_APP_TMDB_KEY,
    },
  };

  const fetchMovies = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/1011985?language=en-US`,
      OPTIONS
    );
    const json = await data.json();
    setMovieDetails(json);
    console.log(json);
  };

  const imgUrl = IMG_CDN_ORG + movieDetails?.poster_path;
  return (
    <div>
      {/* <VideoAmbilight videoSrc={video} /> */}
      <ImageAmbilight imageSrc={imgUrl} />
    </div>
  );
};

export default Test;
