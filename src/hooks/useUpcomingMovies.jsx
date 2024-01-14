import { OPTIONS } from '../utils/constants'
import { useDispatch } from 'react-redux'
import { addUpcomingMovies } from '../utils/moviesSlice'
import { useEffect } from 'react'


const useUpcomingMovies = () => {

    //Fetching TMDB API and updating the store
    const dispatch = useDispatch()

    const getUpcomingMovies = async () => {
        const data = await fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', OPTIONS)

        const json = await data.json()
        dispatch(addUpcomingMovies(json.results))
    }

    useEffect(() => {
        getUpcomingMovies()
    }, [])
}

export default useUpcomingMovies