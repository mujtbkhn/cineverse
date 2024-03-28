import React from 'react'
import { useSelector } from 'react-redux'
import HeroSection from './HeroSection'

const MainContainer = () => {
    const movies = useSelector((store) => store.movies?.nowPlayingMovies)
    if (!movies) return

    const mainMovie = movies[0]

    const { original_title, overview, id } = mainMovie;


    return (
        <div>
            <HeroSection />
        </div>
    )
}

export default MainContainer