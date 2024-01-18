import React, { useEffect } from "react";
import { auth } from "../utils/firebase.config";
import { useNavigate } from "react-router-dom";
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
    <div className="absolute z-10 items-center w-screen px-8 py-2 md:bg-transparent bg-gradient-to-b from-black">
      <div className="justify-between md:flex">
      
      <img className="mx-auto md:mx-0 w-44" src={LOGO} alt="logo" />

      {user && (
        <div className="flex items-center justify-around p-1">
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
            className="h-0 px-8 mr-3 text-white bg-purple-600 rounded-md md:h-10"
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
            className="p-2 ml-2 font-bold text-white"
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
