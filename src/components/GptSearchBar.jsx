import React from 'react'
import lang from "../utils/langConstants"
import { useSelector } from 'react-redux'

const GptSearchBar = () => {
  const langKey = useSelector((store) => store.config.lang)
  return (
    <div className='pt-[20%] flex justify-center'>
        <form className='grid w-1/2 grid-cols-12 bg-black'>
            <input type='text' className='col-span-9 p-4 m-4' placeholder={lang[langKey].placeholder} />
            <button className='col-span-3 px-4 py-2 m-4 text-white bg-red-700 rounded-lg'>{lang[langKey].search}</button>
        </form>
    </div>
  )
  //here we pass in langKey in array format because lang doesn't know what langKey is 
}

export default GptSearchBar