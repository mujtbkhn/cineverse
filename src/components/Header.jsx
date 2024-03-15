import React, { useEffect } from "react";
import { auth } from "../utils/firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { LOGO, SUPPORTED_LANGUAGES } from "../utils/constants";
import { toggleGptSearchView } from "../utils/gptSlice";
import { changeLanguage } from "../utils/configSlice";

const Header = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        navigate("/error");
      });
  };

  //VERY VERY IMPORTANT!!
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties

        const { uid, email, displayName, photoURL } = user;
        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    return () => unsubscribe(); //for unsubscribing the store because after every render onAuthStateChanged is adding a listener to our component
  }, []);

  const handleGPTSearchClick = () => {
    dispatch(toggleGptSearchView());
  };

  const handleLangChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };
const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  return (
    <div className="absolute z-10 w-screen px-8 py-2 md:bg-transparent bg-gradient-to-b from-black">
      <div className="justify-between my-auto md:flex">
      
      <img className="m-auto w-36 md:mx-0" src={LOGO} alt="logo" />

     <Link to={"/exploreMovies"}> <button className="h-10 px-8 my-auto mr-3 text-white bg-purple-600 rounded-md " >
          Explore Movies
      </button>
      </Link>
      {user && (
        <div className="flex justify-center pt-5 text-center align-middle">
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

          <button
            className="h-10 px-8 mr-3 text-white bg-purple-600 rounded-md"
            onClick={handleGPTSearchClick}
          >
            {showGptSearch ? "HomePage" : "GPT-Search"}
          </button>
          <img
            className="w-10 h-10 rounded-full"
            alt="icon"
            src={user.photoURL}
            />
          <button
            className="ml-2 -mt-16 font-bold text-white"
            onClick={handleSignOut}
            >
            (Sign Out)
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default Header;
