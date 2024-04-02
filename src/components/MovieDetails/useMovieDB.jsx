import React, { useEffect, useState } from "react";
import { OPTIONS } from "../../utils/constants";

const useMovieDB = ({ movieId }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailerVideo, setTrailerVideo] = useState(null);
  const [details, setDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState(null);
  const [actor, setActor] = useState([]);
  const [personId, setPersonId] = useState(null);

  const fetchData = async (endpoint, setStateCallback) => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}${endpoint}`,
      OPTIONS
    );
    const json = await data.json();
    setStateCallback(json);
  };
  useEffect(() => {
    const fetchMovieData = async () => {
      await fetchData("", setMovieDetails);
      await fetchData("/videos?language=en-US", (json) => {
        const filteredData = json.results.filter(
          (video) => video.type === "Trailer"
        );
        const trailer = filteredData.length ? filteredData[0] : json.results[0];
        setTrailerVideo(trailer);
      });
      await fetchData("", setDetails);
      await fetchData("/images", (json) => setImages(json.backdrops));
      await fetchData("/reviews", setReviews);
      await fetchData("/similar", (json) => setSimilarMovies(json.results));
      await fetchData("/credits", (json) => {
        setCast(json.cast);
        const directorData = json.crew.find(
          (member) => member.job === "Director"
        );
        const actorData = json.cast
          .slice(0, 3)
          .map((actor) => actor.name + " ");
        setActor(actorData);
        if (directorData) {
          setDirector(directorData.name);
        }
      });
    };

    if (movieId) {
      fetchMovieData();
    }
  }, [movieId]);

  const fetchPerson = async (personName) => {
    const encodedPersonName = encodeURIComponent(personName);
    const data = await fetch(
      `https://api.themoviedb.org/3/search/person?query=${encodedPersonName}&include_adult=false&language=en-US&page=1`,
      OPTIONS
    );
    const json = await data.json();
    const id = json.results[0]?.id;
    setPersonId(id);
  };

  return {
    movieDetails,
    trailerVideo,
    details,
    images,
    reviews,
    similarMovies,
    cast,
    director,
    actor,
    personId,
    fetchPerson,
  };
};

export default useMovieDB;
