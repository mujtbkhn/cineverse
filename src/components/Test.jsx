import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IMG_CDN, IMG_CDN_ORG, OPTIONS } from "../utils/constants";
import MovieCard from "./MovieCard";
import useDebounce from "../hooks/useDebounce";
import Header from "./Header";

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

  const searchText = useRef();
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  useEffect(() => {
    fetchMovies();

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
  };

  // other functions remain the same

  return (
    <div className="bg-[#04152D] text-white">
      <div className="flex pb-14">
        <Header enableAuthentication={false} />
      </div>
      <div className="flex flex-col justify-center md:flex-row">
        <div className="flex justify-center text-black">
          <input
            ref={searchText}
            value={searchTerm}
            className="relative border-2 rounded-md md:w-48 w-28 md:m-2 md:py-2 md:px-5"
            type="text"
            placeholder="Search Movie or Person"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="absolute flex flex-wrap text-black bg-gray-200 top-20 w-[800px] mt-6 my-auto">
            {suggestions.map((result) => {
              if (result.media_type === "movie" && result.poster_path) {
                return (
                  <li key={result.id} className="text-black">
                    <h1>{result.title}</h1>
                    <MovieCard
                      key={result.id}
                      posterPath={result?.poster_path}
                      id={result.id}
                    />
                  </li>
                );
              } else if (result.media_type === "person" && result.profile_path) {
                return (
                  <li key={result.id} className="text-black">
                    <Link to={`/person/${result.id}`}>
                      <h1>{result.name}</h1>
                      <img
                        className="w-48"
                        src={IMG_CDN_ORG + result.profile_path}
                      />
                    </Link>
                  </li>
                );
              } else {
                return null;
              }
            })}
          </ul>
        </div>
        {/* other JSX remains the same */}
      </div>
      {/* other JSX remains the same */}
    </div>
  );
};

export default MovieDetails;
