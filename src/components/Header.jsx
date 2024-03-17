import React, { useEffect, useRef, useState } from "react";
import { auth } from "../utils/firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  LOGO,
  OPTIONS,
  search_img,
  SUPPORTED_LANGUAGES,
} from "../utils/constants";
import { toggleGptSearchView } from "../utils/gptSlice";
import { changeLanguage } from "../utils/configSlice";
import useDebounce from "../hooks/useDebounce";
import MovieCard from "./MovieCard";
import useAuthentication from "../hooks/useAuthentication";

const Header = ({ enableAuthentication = true }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const searchText = useRef();
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (enableAuthentication) {
    useAuthentication();
  }

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

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        navigate("/error");
      });
  };

  const handleGPTSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  const handleLangChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  return (
    <div className="absolute z-10 w-full px-8 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-1 ">
      <div className="justify-between my-auto md:flex">
      <Link to={"/browse"}>  <img className="object-contain w-20 md:mx-0" src={LOGO} alt="logo" /></Link>

        {user && (
          <div className="flex justify-center pt-5 mr-24 text-center align-middle">
            <Link to={"/exploreMovies"}>
              {" "}
              <div className="text-xl text-white hover:text-red-700">Movies</div>
            </Link>
            <img
              className="mx-4 w-7 h-7"
              src={search_img}
              alt={"search for movies"}
            />
            <div className="absolute left-0 right-0 flex-col justify-center hidden w-3/4 mx-auto top-20">
              <input
                ref={searchText}
                value={searchTerm}
                className="relative px-5 py-5 border-2 rounded-md"
                type="text"
                placeholder="Enter Movie Name"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ul className="absolute flex flex-wrap mx-auto my-auto mt-6 overflow-y-scroll bg-gray-200 pl-14 top-10 z-999">
                {suggestions?.results?.map((movie, index) => {
                  const movieTitle = movie.title.slice(0, 20) + "...";
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
            <span className="group ">
              <img
                className="relative w-10 h-10 rounded-full"
                alt="icon"
                src={user.photoURL}
              />

              <div className="absolute flex-col hidden px-8 py-5 bg-gray-200 rounded-md right-10 top-20 group-hover:flex ">
                <button
                  className="px-2 py-2 m-2 text-white bg-purple-600 rounded-md"
                  onClick={handleGPTSearchClick}
                >
                  {showGptSearch && (
                    <select
                      className="p-2 m-2 text-white bg-gray-900"
                      onChange={handleLangChange}
                    >
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <option key={lang.identifier} value={lang.identifier}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {showGptSearch ? "HomePage" : "GPT-Search"}
                </button>
                <button className="px-2 py-2 m-2 text-white bg-red-700 rounded-md md:px-5">
                  <Link to={"/favorite"}> Favorites</Link>
                </button>
                <button className="px-2 py-2 m-2 text-white bg-black rounded-md md:px-5">
                  <Link to={"/watchlist"}> WatchList</Link>
                </button>
                <button
                  className="flex justify-center font-bold "
                  onClick={handleSignOut}
                >
                  (Sign Out)
                </button>
              </div>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
