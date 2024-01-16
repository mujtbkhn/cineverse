import React from 'react'

const VideoTitle = ({ title, overview }) => {
    return (
        <div className='w-screen pt-[15%] aspect-video absolute bg-gradient-to-r from-black text-white'>
            <h2 className='p-6 text-6xl font-bold '>{title}</h2>
            <p className='w-1/3 p-6 text-xl '>{overview}</p>
            <div>
                <button className='px-16 py-4 mx-5 font-bold text-black bg-white bg-opacity-50 border-2 border-black rounded-md '>Play</button>
                <button className='px-16 py-4 font-bold text-black bg-gray-300 bg-opacity-50 rounded-md '>More Info</button>
            </div>
        </div>
    )
}

export default VideoTitle