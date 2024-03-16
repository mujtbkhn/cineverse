import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase.config";
import { addUser, removeUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

// Custom hook for authentication logic
const useAuthentication = (enableAuthentication = true) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!enableAuthentication) return; // Skip authentication logic if not enabled

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
  }, [dispatch, navigate, enableAuthentication]);
};

export default useAuthentication;
