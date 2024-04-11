import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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

  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  useEffect(() => {
    fetchMovies();
    fetchDetails();
    fetchImages();
    fetchReviews();
    fetchSimilarMovies();
    fetchCast();
    getMovieVideos();
    fetchDirector();

    try {
      const favoritesFromStorage = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );
      const isFavorite = favoritesFromStorage.some(
        (movie) => movie.id === parseInt(movieId)
      );
      setFav(isFavorite);
    } catch (error) {
      console.error("Error parsing favorites from localStorage:", error);
      // Handle the error, e.g., set the 'fav' state to false
      setFav(false);
    }
    try {
      const watchListsFromStorage = JSON.parse(
        localStorage.getItem("WatchList") || "[]"
      );
      const isWatchList = watchListsFromStorage.some(
        (movie) => movie.id === parseInt(movieId)
      );
      setWatchList(isWatchList);
    } catch (error) {
      console.error("Error parsing favorites from localStorage:", error);
      // Handle the error, e.g., set the 'fav' state to false
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
        });
    };
    fetchSuggestions();
  }, [debouncedSearchTerm]);

  const fetchMovies = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      OPTIONS
    );
    const json = await data.json();
    setMovieDetails(json);
    // console.log(json);
  };

  const getMovieVideos = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/" +
        movieId +
        "/videos?language=en-US",
      OPTIONS
    );
    const json = await data.json();
    const filteredData = json.results.filter(
      (video) => video.type === "Trailer"
    );
    const trailer = filteredData.length ? filteredData[0] : json.results[0];
    // console.log(trailer);
    setTrailerVideo(trailer);
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
    setImages(json.backdrops);
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
  const fetchDirector = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      OPTIONS
    );
    const json = await data.json();
    // console.log(json);

    const director = json.crew.find((member) => member.job === "Director");
    const actor = json.cast.slice(0, 3);

    const actorName = actor.map((actor) => actor.name + " ");
    setActor(actorName);
    // console.log(actorName);
    if (director) {
      setDirector(director.name);
    }
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

  const handleRatingChanged = (newRating) => {
    console.log("New Rating:", newRating);

    setRating(newRating);
    addRating(newRating);
    setRate(true);
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
        setWatchList(true);
      })
      .catch((err) => console.error("error:" + err));
  };

  const addRating = (newRating) => {
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
      .catch((err) => console.error("error:" + err));
  };

  if (!movieDetails) return <div>Loading...</div>;

  const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (releaseDate) => {
    const date = new Date(releaseDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

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
            <h2 className="text-gray-300">
              {formatDate(movieDetails?.release_date)}
            </h2>
            <h2 className="text-gray-300">{formatMinutes(details?.runtime)}</h2>
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
                    key={genre.id} // Make sure to provide a unique key
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
        {/* <h2 className="text-3xl ">Photos: </h2>
        <div className="flex h-40 gap-2 overflow-x-scroll scrollbar-hide">
          {images.map((image) => (
            <img
              className="flex rounded-md"
              src={IMG_CDN_ORG + image?.file_path}
            />
          ))}
        </div> */}
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
