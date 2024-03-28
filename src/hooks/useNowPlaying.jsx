import { OPTIONS } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addNowPlayingMovies } from '../utils/moviesSlice'
import { useEffect } from 'react'


const useNowPlayingMovies = () => {

    const dispatch = useDispatch()

    const nowPlayingMovies = useSelector((store) => store.nowPlayingMovies);

    const getNowPlayingMovies = async () => {
        const data = await fetch('https://api.themoviedb.org/3/movie/now_playing?page=1', OPTIONS)
        const json = await data.json()

        // const page2Data = await fetch('https://api.themoviedb.org/3/movie/now_playing?page=2', OPTIONS)
        // const page2Json = await page2Data.json()

        // const allResults = [...page1Json.results, ...page2Json.results]
        dispatch(addNowPlayingMovies(json.results))
    }

    useEffect(() => {
        !nowPlayingMovies && getNowPlayingMovies()
    }, [])
}

export default useNowPlayingMovies