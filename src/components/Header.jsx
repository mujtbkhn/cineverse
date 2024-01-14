import React, { useEffect } from 'react'
import { auth } from '../utils/firebase.config'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { addUser, removeUser } from '../utils/userSlice'
import { LOGO } from '../utils/constants'

const Header = () => {
  const user = useSelector(store => store.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSignOut = () => {

    signOut(auth).then(() => {
    }).catch((error) => {
      navigate('/error')
    })
  }

  //VERY VERY IMPORTANT!!
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties

        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid: uid, email: email, displayName: displayName, photoURL: photoURL }))
        navigate('/browse')
      } else {
        dispatch(removeUser())
        navigate('/')
      }
    });

    return () => unsubscribe() //for unsubscribing the store because after every render onAuthStateChanged is adding a listener to our component 
  }, [])
  return (
    <div className='absolute z-10 flex items-center justify-between w-screen px-8 py-2 bg-gradient-to-b from-black'>
      <div className='flex items-center'>
        <img className='w-36' src={LOGO} alt='logo' />
      </div>
  
      {user && (
        <div className='flex items-center'>
          <img className='w-12 h-12 rounded-full' alt='icon' src={user.photoURL} />
          <button className='p-2 ml-2 font-bold text-white' onClick={handleSignOut}>
            (Sign Out)
          </button>
        </div>
      )}
    </div>
  );
  
}

export default Header