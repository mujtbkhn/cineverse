import { useEffect } from 'react'
import { OPTIONS } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addTrailerVideo } from '../utils/moviesSlice'

export const useMovieTrailer = (movieId) => {

    const dispatch = useDispatch()

    const trailerVideo = useSelector((store) => store.trailerVideo);

    const getMovieVideos = async () => {
        const data = await fetch('https://api.themoviedb.org/3/movie/' + movieId + '/videos?language=en-US', OPTIONS)
        const json = await data.json()
        const filteredData = json.results.filter((video) => video.type === 'Trailer')
        const trailer = filteredData.length ? filteredData[0] : json.results[0]
        dispatch(addTrailerVideo(trailer))
    }
    useEffect(() => {
       !trailerVideo && getMovieVideos()
    }, [])
}