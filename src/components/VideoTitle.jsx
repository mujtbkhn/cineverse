import React from 'react'

const VideoTitle = ({ title, overview }) => {
    return (
        <div className='w-[80%] pt-[90%] md:pt-[13%] aspect-video absolute bg-gradient-to-r from-black text-white '>
            <h2 className='p-3 text-xl font-bold md:p-6 md:text-6xl'>{title}</h2>
            <p className=' hidden md:block w-[55%] p-3 md:p-6 md:text-xl md:w-1/3 '>{overview}</p>
            <div>
                <button className='px-8 py-2 ml-2 mr-2 font-bold bg-white bg-opacity-50 border-2 border-black rounded-md md:text-black md:px-16 md:py-4 md:mx-5'>Play</button>
                <button className='hidden px-8 py-2 font-bold bg-gray-300 bg-opacity-50 rounded-md md:inline md:text-black md:px-16 md:py-4'>More Info</button>
            </div>
        </div>
    )
}

export default VideoTitle