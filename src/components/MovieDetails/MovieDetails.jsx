import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { IMG_CDN, IMG_CDN_ORG, OPTIONS } from "../../utils/constants";
import MovieCard from "../MovieCard";
import useDebounce from "../../hooks/useDebounce";
import Header from "../MainContainer/Header";
import Rating from "../MainContainer/rating";
import "react-toastify/dist/ReactToastify.css";
import "./Test.css";
import ImageAmbilight from "../../utils/ImageAmbilight";
import Photos from "./Photos";

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [details, setDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [personId, setPersonId] = useState(null);
  const [fav, setFav] = useState(false);
  const [watchList, setWatchList] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [trailerVideo, setTrailerVideo] = useState("");
  const [director, setDirector] = useState("");
  const [actor, setActor] = useState("");
  const [rating, setRating] = useState("");
  const [rate, setRate] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const fetchMovies = useCallback(async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
        OPTIONS
      );
      const json = await data.json();
      setMovieDetails(json);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setError("Failed to fetch movie details");
    }
  }, [movieId]);

  const fetchDetails = useCallback(async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        OPTIONS
      );
      const json = await data.json();
      setDetails(json);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setError("Failed to fetch movie details");
    }
  }, [movieId]);

  const fetchImages = useCallback(async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/images`,
        OPTIONS
      );
      const json = await data.json();
      setImages(json.backdrops);
    } catch (error) {
      console.error("Error fetching images:", error);
      setError("Failed to fetch images");
    }
  }, [movieId]);

  const fetchReviews = useCallback(async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/reviews`,
        OPTIONS
      );
      const json = await data.json();
      setReviews(json);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to fetch reviews");
    }
  }, [movieId]);

  const fetchSimilarMovies = useCallback(async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/similar`,
        OPTIONS
      );
      const json = await data.json();
      setSimilar(json.results);
    } catch (error) {
      console.error("Error fetching similar movies:", error);
      setError("Failed to fetch similar movies");
    }
  }, [movieId]);

  const fetchCast = useCallback(async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits`,
        OPTIONS
      );
      const json = await data.json();
      setCast(json.cast);
    } catch (error) {
      console.error("Error fetching cast:", error);
      setError("Failed to fetch cast");
    }
  }, [movieId]);

  const getMovieVideos = useCallback(async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
        OPTIONS
      );
      const json = await data.json();
      const filteredData = json.results.filter(
        (video) => video.type === "Trailer"
      );
      const trailer = filteredData.length ? filteredData[0] : json.results[0];
      setTrailerVideo(trailer);
    } catch (error) {
      console.error("Error fetching movie videos:", error);
      setError("Failed to fetch movie videos");
    }
  }, [movieId]);

  const fetchDirector = useCallback(async () => {
    try {
      const data = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits`,
        OPTIONS
      );
      const json = await data.json();
      const director = json.crew.find((member) => member.job === "Director");
      const actor = json.cast.slice(0, 3);
      const actorName = actor.map((actor) => actor.name + " ");
      setActor(actorName);
      if (director) {
        setDirector(director.name);
      }
    } catch (error) {
      console.error("Error fetching director:", error);
      setError("Failed to fetch director information");
    }
  }, [movieId]);

  useEffect(() => {
    fetchMovies();
    fetchDetails();
    fetchImages();
    fetchReviews();
    fetchSimilarMovies();
    fetchCast();
    getMovieVideos();
    fetchDirector();
  }, [movieId, fetchMovies, fetchDetails, fetchImages, fetchReviews, fetchSimilarMovies, fetchCast, getMovieVideos, fetchDirector]);

  useEffect(() => {
    try {
      const favoritesFromStorage = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );
      const isFavorite = favoritesFromStorage.some(
        (movie) => movie.id === parseInt(movieId)
      );
      setFav(isFavorite);

      const watchListsFromStorage = JSON.parse(
        localStorage.getItem("WatchList") || "[]"
      );
      const isWatchList = watchListsFromStorage.some(
        (movie) => movie.id === parseInt(movieId)
      );
      setWatchList(isWatchList);
    } catch (error) {
      console.error("Error parsing data from localStorage:", error);
      setFav(false);
      setWatchList(false);
    }
  }, [movieId]);

  useEffect(() => {
    const fetchSuggestions = () => {
      if (debouncedSearchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }

      const url = `https://api.themoviedb.org/3/search/multi?query=${debouncedSearchTerm}&include_adult=false&language=en-US&page=1`;
      fetch(url, OPTIONS)
        .then((res) => res.json())
        .then((json) => {
          setSuggestions(json.results);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch suggestions");
        });
    };
    fetchSuggestions();
  }, [debouncedSearchTerm]);

  const handleRatingChanged = useCallback((newRating) => {
    console.log("New Rating:", newRating);
    setRating(newRating);
    addRating(newRating);
    setRate(true);
  }, []);

  const addToWatchList = useCallback(() => {
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
        media_id: movieId,
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
      })
      .catch((err) => {
        console.error("error:" + err);
        setError("Failed to add to watchlist");
      });
  }, [movieId, details]);

  const addRating = useCallback((newRating) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/rating`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + process.env.REACT_APP_TMDB_KEY,
      },
      body: JSON.stringify({ value: newRating }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => {
        console.error("error:" + err);
        setError("Failed to add rating");
      });
  }, [movieId]);

  const fetchPerson = useCallback(async (personName) => {
    try {
      const encodedPersonName = encodeURIComponent(personName);
      const data = await fetch(
        `https://api.themoviedb.org/3/search/person?query=${encodedPersonName}&include_adult=false&language=en-US&page=1`,
        OPTIONS
      );
      const json = await data.json();
      const id = json.results[0]?.id;
      setPersonId(id);
    } catch (error) {
      console.error("Error fetching person:", error);
      setError("Failed to fetch person information");
    }
  }, []);

  const formatMinutes = useCallback((minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }, []);

  const formatDate = useCallback((releaseDate) => {
    const date = new Date(releaseDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }, []);

  const formattedRuntime = useMemo(() => formatMinutes(details?.runtime), [details?.runtime, formatMinutes]);
  const formattedReleaseDate = useMemo(() => formatDate(movieDetails?.release_date), [movieDetails?.release_date, formatDate]);

  if (error) return <div>Error: {error}</div>;
  if (!movieDetails) return <div>Loading...</div>;

  const imgUrl = IMG_CDN_ORG + movieDetails?.poster_path;

  return (
    <div className="w-full text-white font-roboto">
      <div className="flex pb-16 md:pt-4 md:pb-14">
        <Header enableAuthentication={false} />
      </div>
      <div className="flex flex-col px-18 md:px-48">
        <div>
          <h1 className="my-8 text-3xl md:text-6xl">{movieDetails?.title}</h1>
        </div>
        <div className="flex items-center justify-between mx-4 md:mx-10 md:gap-10 ">
          <div className="flex md:gap-6">
            <h2 className="text-gray-300">{formattedReleaseDate}</h2>
            <h2 className="text-gray-300">{formattedRuntime}</h2>
          </div>
          <div className="flex gap-10">
            <button className="flex gap-2 px-2 py-1 bg-gray-100 rounded-md border-1 bg-opacity-20">
              <span className=" group">
                <img
                  className="w-7"
                  src={
                    rate
                      ? "https://img.icons8.com/fluency/48/star--v1.png"
                      : "https://img.icons8.com/ios/50/737373/star--v1.png"
                  }
                />
                <div className="absolute hidden group-hover:flex top-32">
                  {" "}
                  <Rating onRatingChanged={handleRatingChanged} />
                </div>
              </span>
              <button className="my-auto">Rate</button>
            </button>
            <div className="flex gap-2 px-2 py-1 bg-gray-100 rounded-md border-1 bg-opacity-20">
              <img
                className="object-contain w-6 "
                src="https://img.icons8.com/fluency/48/star--v1.png"
                alt="star--v1"
              />
              <h2 className="my-auto">
                {movieDetails?.vote_average.toFixed(1)}/10
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="justify-center px-4 mt-10 md:px-44 md:flex-col md:flex">
        <div className="flex flex-col gap-5 mx-auto md:gap-0 w-60 md:w-full md:flex-row">
          <ImageAmbilight imageSrc={imgUrl} crossorigin="anonymous" />
          <iframe
            className="w-full aspect-video"
            src={
              "https://www.youtube.com/embed/" + trailerVideo?.key
              // " + ?&autoplay=1&mute=1"
            }
            title="YouTube video player"
            allow="accelerometer; autoplay;clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </div>
        <div className="flex flex-col gap-10 my-10">
          <div className="flex flex-col gap-10 md:flex-row">
            <h2 className="mx-auto md:text-xl w-18">Overview</h2>
            <h3 className="md:text-xl">{movieDetails?.overview}</h3>
          </div>
          <div className="flex items-center gap-10">
            <h2 className="text-xl md:w-52">Genre</h2>
            <div className="flex flex-wrap md:gap-20">
              {details &&
                details.genres.map((genre) => (
                  <button
                    key={genre.id} 
                    className="flex items-center justify-center h-10 px-5 text-gray-100 bg-white bg-opacity-40 rounded-2xl"
                  >
                    <h3>{genre.name}</h3>
                  </button>
                ))}
            </div>

            <button
              onClick={() => {
                addToWatchList();
              }}
              className="flex justify-center px-6 py-2 m-4 mx-auto text-black bg-[#f5c518] rounded-md w-48"
            >
              {watchList ? "Added to watchList" : "Add to watchList"}
            </button>
          </div>
          <div className="flex gap-10">
            <h2 className="md:text-xl md:w-52">Director</h2>
            <h3 className="text-yellow-500 md:text-xl">{director}</h3>
          </div>
          <div className="flex gap-10">
            <h2 className="md:text-xl md:w-52">Stars</h2>
            <h3 className="text-yellow-500 md:text-xl">{actor}</h3>
          </div>
        </div>
        <Photos />
        <h2 className="text-3xl ">Cast: </h2>
        <div className="flex flex-wrap justify-center gap-10 ">
          {cast
            ?.map((cast) => (
              <div className="flex flex-col flex-wrap" key={cast.id}>
                <Link to={personId ? `/person/${personId}` : "#"}>
                  {cast.profile_path ? (
                    <img
                      onClick={() => fetchPerson(cast?.original_name)}
                      className="object-cover w-20 rounded-md h-36 md:w-32"
                      src={IMG_CDN + cast?.profile_path}
                    />
                  ) : null}
                </Link>
                <h1 className="font-bold">
                  {window.innerWidth < 768
                    ? cast?.original_name.slice(0, 10) + "..."
                    : cast?.original_name.slice(0, 15) + "..."}
                </h1>
                <h2>
                  {window.innerWidth < 768
                    ? cast?.character.slice(0, 10) + "..."
                    : cast?.character.slice(0, 15) + "..."}
                </h2>
              </div>
            ))
            .slice(0, 8)}
        </div>
        <h1 className="p-5 my-10 text-5xl ">More like this</h1>
        <div className="flex flex-wrap justify-center gap-10 md:flex-row md:justify-center ">
          {similar.map((movie) => (
            <MovieCard
              className="flex flex-wrap justify-center gap-10 p-1 m-2 md:p-5 md:m-5"
              key={movie.id}
              posterPath={movie?.poster_path}
              id={movie.id}
              rating={movie.vote_average.toFixed(1)}
              trimmedTitle={
                movie.title.length > 10
                  ? movie.title.slice(0, 15) + "..."
                  : movie.title
              }
              release_date={movie.release_date}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
