import { useSelector } from "react-redux"
import { useMovieTrailer } from "../hooks/useMovieTrailer"

//fetching trailer video && updating the store with trailer video data

const VideoBackground = ({movieId}) => {
    const trailerVideo = useSelector((store) => store.movies?.trailerVideo)
    
    useMovieTrailer(movieId)
    
    return (
        <div className='h-screen ' >
            {/* + "?&autoplay=1&mute=1" */}
            <iframe className="absolute w-screen h-screen aspect-video" src={"https://www.youtube.com/embed/" + trailerVideo?.key  } 
            title="YouTube video player" allow="accelerometer; autoplay;clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>
        </div>
    )
}

export default VideoBackground