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
  const [personSuggestions, setPersonSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchPerson, setSearchPerson] = useState("");
  const [trailerVideo, setTrailerVideo] = useState("");
  const [director, setDirector] = useState("");
  const [actor, setActor] = useState("");

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
    const fetchUsers = () => {
      if (debouncedSearchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }

      const url = `https://api.themoviedb.org/3/search/multi?query=${debouncedSearchTerm}&include_adult=false&language=en-US&page=1`;
      fetch(url, OPTIONS)
        .then((res) => res.json())
        .then((json) => {
          // console.log(json);
          setSuggestions(json);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    fetchUsers();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const searchPersons = () => {
      if (searchPerson.trim() === "") {
        setPersonSuggestions([]);
        return;
      }

      const url = `https://api.themoviedb.org/3/search/person?query=${searchPerson}&include_adult=false&language=en-US&page=1`;
      fetch(url, OPTIONS)
        .then((res) => res.json())
        .then((json) => {
          // console.log(json);
          setPersonSuggestions(json);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    searchPersons();
  }, [searchPerson]);

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

    const actorName = actor.map((actor) => actor.name);
    setActor(actorName);
    console.log(actorName);
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
    <div className="bg-[#04152D] text-white">
      {/* <Header enableAuthentication={false} /> */}
      <div className="flex flex-col justify-center md:flex-row">
        <div className="flex justify-center text-black">
          <input
            ref={searchText}
            value={searchTerm}
            className="relative border-2 rounded-md md:w-48 w-28 md:m-2 md:py-2 md:px-5"
            type="text"
            placeholder="Enter Movie Name"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="absolute flex flex-wrap text-black bg-gray-200 top-20 w-[800px] mt-6 my-auto">
            {suggestions?.results?.map((movie) => {
              if (movie.poster_path) {
                return (
                  <li key={movie.id} className="text-black">
                    <h1>{movie.title}</h1>
                    <MovieCard
                      key={movie.id}
                      posterPath={movie?.poster_path}
                      id={movie.id}
                      rating={movie.vote_average.toFixed(1)}
                      trimmedTitle={
                        movie.title?.length > 10
                          ? movie.title.slice(0, 15) + "..."
                          : movie.title
                      }
                      release_date={movie.release_date}
                    />
                  </li>
                );
              } else {
                return null;
              }
            })}
          </ul>
        </div>
        <div className="flex justify-center text-black">
          <input
            // ref={searchText}
            value={searchPerson}
            className="relative border-2 rounded-md md:w-48 w-28 md:m-2 md:py-2 md:px-5"
            type="text"
            placeholder="Enter Movie Name"
            onChange={(e) => setSearchPerson(e.target.value)}
          />
          <ul className="absolute flex flex-wrap text-black bg-gray-200 top-20 w-[800px] mt-6 my-auto">
            {/* {personSuggestions?.results?.map((movie) => {
              // const movieTitle = movie.title.slice(0, 25) + "...";
              if (movie.poster_path) {
                return (
                  <li key={movie.id} className="text-black">
                    <h1>{movie.title}</h1>
                    <MovieCard
                      key={movie.id}
                      posterPath={movie?.poster_path}
                      id={movie.id}
                      rating={movie.vote_average.toFixed(1)}
                      trimmedTitle={
                        movie.title?.length > 10
                          ? movie.title.slice(0, 15) + "..."
                          : movie.title
                      }
                      release_date={movie.release_date}
                    />
                  </li>
                );
              } else {
                return null;
              }
            })} */}
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
      <div className="justify-center px-48 md:flex-col md:flex">
        <div className="flex m-5">
          <div className="flex flex-col w-full">
            {/* <h1 className="text-2xl font-bold">
              {movieDetails?.title}
            </h1> */}
            <img
              className=""
              src={IMG_CDN_ORG + movieDetails?.poster_path}
              alt={movieDetails?.title}
            />
          </div>
          <div className="flex flex-col w-full gap-2 m-4 md:m-10">
            {/* <h1 className="text-xl italic font-semibold">{details?.tagline}</h1> */}

            <iframe
              className=" aspect-video"
              src={
                "https://www.youtube.com/embed/" + trailerVideo?.key
                // " + ?&autoplay=1&mute=1"
              }
              title="YouTube video player"
              allow="accelerometer; autoplay;clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
        <div>
          <h3>Overview: {movieDetails?.overview}</h3>
          <div className="flex flex-row justify-center gap-10 m-1 font-bold">
            Genre:{" "}
            <div className="flex gap-20">
              {" "}
              {details &&
                details.genres.map((genre) => (
                  <div className="flex justify-center w-48 h-10 bg-black opacity-40 rounded-2xl">
                    {" "}
                    <h3>{genre.name}</h3>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex">director: {director}</div>
          <div className="flex">Stars: {actor}</div>
          <h2>
            Release Date:{" "}
            <div className="inline font-bold">{movieDetails?.release_date}</div>
          </h2>
          <div className="flex justify-start gap-10">
            <h2>Rating: {movieDetails?.vote_average}</h2>
            <h2>Runtime: {details?.runtime}min</h2>
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
        {/* <div></div> */}
        <h2 className="text-3xl ">Photos: </h2>
        <div className="flex h-40 gap-2 overflow-x-scroll scrollbar-hide">
          {images.map((image) => (
            <img
              className="flex rounded-md"
              src={IMG_CDN_ORG + image?.file_path}
            />
          ))}
        </div>
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
        <h1 className="p-4 text-3xl font-bold ">Similar Movies:</h1>
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
