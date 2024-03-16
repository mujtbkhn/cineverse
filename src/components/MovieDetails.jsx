import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { IMG_CDN, OPTIONS } from "../utils/constants";
import MovieCard from "./MovieCard";
import Accordion from "./Accordion";
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

  const searchText = useRef();
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  useEffect(() => {
    fetchMovies();
    fetchDetails();
    fetchImages();
    fetchReviews();
    fetchSimilarMovies();
    fetchCast();

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
    const fetchUsers = () => {
      if (debouncedSearchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }

      const url = `https://api.themoviedb.org/3/search/movie?query=${debouncedSearchTerm}&include_adult=false&language=en-US&page=1`;
      fetch(url, OPTIONS)
        .then((res) => res.json())
        .then((json) => setSuggestions(json))
        .catch((err) => {
          console.error(err);
        });
    };
    fetchUsers();
  }, [debouncedSearchTerm]);

  // const handleSearch = useCallback(() => {
  //   const url = `https://api.themoviedb.org/3/search/movie?query=${searchText.current.value}&include_adult=false&language=en-US&page=1`;
  //   fetch(url, OPTIONS)
  //     .then((res) => res.json())
  //     .then((json) => {
  //       if (json && json.results && json.results.length > 0) {
  //         // console.log(json.results);
  //         const movieId = json.results[0]?.id;
  //         // Redirect to the MovieDetails page with the correct movieId
  //         navigate(`/movieDetails/${movieId}`);
  //       } else {
  //         console.log("No movie found");
  //         // Optionally, you can provide feedback to the user
  //       }
  //     })
  //     .catch((err) => console.error("error:" + err));
  // }, [navigate]);

  const fetchMovies = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
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
        media_id: details.id,
        watchlist: true,
      }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        setWatchList(true);

        const existingWatchLists =
          JSON.parse(localStorage.getItem("WatchList")) || [];
        const updatedWatchLists = [...existingWatchLists, details];
        localStorage.setItem("WatchList", JSON.stringify(updatedWatchLists));
        setWatchList(true);
      })
      .catch((err) => console.error("error:" + err));
  }, [details, setWatchList]);

  const addToFavorite = useCallback(() => {
    const url = `https://api.themoviedb.org/3/account/${process.env.REACT_APP_ACCOUNT_ID}/favorite`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: "Bearer " + process.env.REACT_APP_TMDB_KEY,
      },
      body: JSON.stringify({
        media_type: "movie",
        media_id: details.id,
        favorite: true,
      }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        setFav(true);

        const existingFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];
        const updatedFavorites = [...existingFavorites, details];
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setFav(true);
      })
      .catch((err) => console.error("error:" + err));
  }, [details, setFav]);

  const items = useMemo(
    () => [
      {
        title: "Author : ",
        content: <div> {reviews?.results[0]?.author}</div>,
      },
      {
        title: "Review : ",
        content: <div> {reviews?.results[0]?.content}</div>,
      },
    ],
    [reviews]
  );

  if (!movieDetails) return <div>Loading...</div>;

  return (
    <>
      <Header enableAuthentication={false} />
      <div className="flex flex-col justify-center md:flex-row">
        <div className="flex justify-center">
          <input
            ref={searchText}
            value={searchTerm}
            className="relative border-2 rounded-md md:w-48 w-28 md:m-2 md:py-2 md:px-5"
            type="text"
            placeholder="Enter Movie Name"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* <button
            onClick={() => {
              handleSearch();
            }}
            className="px-2 py-2 m-2 text-white bg-black rounded-md md:px-5"
          >
            Search
          </button> */}
          <ul className="absolute flex flex-wrap bg-gray-200 top-20 w-[800px] mt-6 my-auto">
            {suggestions?.results?.map((movie, index) => {
              const movieTitle = movie.title.slice(0, 25) + "...";
              if (movie.poster_path) {
                return (
                  <li key={movie.id}>
                    <h1>{movieTitle}</h1>
                    <MovieCard
                      key={movie.id}
                      posterPath={movie?.poster_path}
                      id={movie.id}
                    />
                  </li>
                );
              } else {
                return null;
              }
            })}
          </ul>
        </div>
        <div className="flex justify-center">
          <button className="px-2 py-2 m-2 text-white bg-red-700 rounded-md md:px-5">
            <Link to={"/favorite"}> Favorites</Link>
          </button>
          <button className="px-2 py-2 m-2 text-white bg-black rounded-md md:px-5">
            <Link to={"/watchlist"}> WatchList</Link>
          </button>
        </div>
      </div>
      <div className="justify-center md:flex-col md:flex ">
        <div className="p-5 mr-10 md:mr-0 md:p-10 md:flex">
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
            <div className="flex flex-row justify-center gap-10 m-1 font-bold">
              {details && details.genres.map((genre) => <h3>{genre.name}</h3>)}
            </div>
            <h2>
              Release Date:{" "}
              <div className="inline font-bold">
                {movieDetails?.release_date}
              </div>
            </h2>
            <div className="flex justify-start gap-10">
              <h2>Rating: {movieDetails?.vote_average}</h2>
              <h2>Runtime: {details?.runtime}min</h2>
            </div>
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
            <div className="flex flex-col items-center justify-between mx-auto md:flex-row">
              <button
                onClick={() => {
                  addToFavorite();
                }}
                className="flex justify-around mx-auto text-4xl md:justify-center w-96"
              >
                {fav ? "❤️" : "♡"}
              </button>
              <button
                onClick={() => {
                  addToWatchList();
                }}
                className="flex justify-center px-8 py-2 m-5 mx-auto font-semibold text-white bg-red-700 rounded-md w-52"
              >
                {watchList ? "Added to watchList" : "Add to watchList"}
              </button>
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
    </>
  );
};

export default MovieDetails;
