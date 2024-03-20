import React, { useEffect, useRef, useState } from "react";
import { auth } from "../utils/firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  IMG_CDN_ORG,
  LOGO,
  OPTIONS,
  search_img,
  SUPPORTED_LANGUAGES,
  USER_AVATAR,
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
    <div className="absolute z-50 w-full md:px-24 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-1 ">
      <div className="items-center justify-between md:flex">
        {user ? (
          <>
            <div className="flex gap-5">
              <Link to={"/browse"}>
                {" "}
                <img
                  className="w-24 my-auto md:w-36 md:mx-0"
                  src="https://www.cineverse.com/images/cineverse/cineverse.svg?imwidth=256"
                  alt="logo"
                />
              </Link>
              <Link className="my-auto " to={"/exploreMovies"}>
                {" "}
                <div className="text-white hover:text-[#f5c518]">Movies</div>
              </Link>
            </div>
            <div className="px-10 text-white w-80 md:w-full">
              <input
                ref={searchText}
                value={searchTerm}
                className="relative flex justify-center w-full px-10 py-2 bg-[#1a1a1a] rounded-md active:border-none"
                type="text"
                placeholder="Search Movie or Person"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ul className="absolute z-50 flex flex-wrap pl-10 mt-6 mr-10 overflow-y-scroll text-white bg-black md:mr-0 md:w-1/2 top-18">
                {suggestions.map((result) => {
                  if (result.media_type === "movie" && result.poster_path) {
                    return (
                      <li key={result.id} className="text-white">
                        <h1>{result.title}</h1>
                        <MovieCard
                          key={result.id}
                          posterPath={result?.poster_path}
                          id={result.id}
                        />
                      </li>
                    );
                  } else if (
                    result.media_type === "person" &&
                    result.profile_path
                  ) {
                    return (
                      <li key={result.id} className="text-white">
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

            <Link to={"/watchlist"}>
              {" "}
              <div className="flex text-white hover:text-[#f5c518]">
                <img
                  className="w-7"
                  src="https://img.icons8.com/ios-filled/50/737373/bookmark-ribbon.png"
                  alt="bookmark-ribbon"
                />{" "}
                Watchlist
              </div>
            </Link>
            {/* {user && ( */}
            <div className="pt-4">
              <span className="group ">
                <img
                  className="relative items-center h-10 ml-10 rounded-full"
                  alt="icon"
                  src={USER_AVATAR}
                />

                <div className="absolute flex-col hidden px-8 py-5 bg-gray-300 rounded-md opacity-80 right-10 top-14 group-hover:flex">
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
                  <button
                    className="flex justify-center font-bold text-black "
                    onClick={handleSignOut}
                  >
                    (Sign Out)
                  </button>
                </div>
              </span>
            </div>
          </>
        ) : (
          <Link to={"/browse"}>
            <img
              className="w-24 my-auto md:w-36 md:mx-0"
              src="https://www.cineverse.com/images/cineverse/cineverse.svg?imwidth=256"
              alt="logo"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
