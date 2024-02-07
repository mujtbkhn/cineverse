import Login from "./Login"
import Browse from "./Browse"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import MovieDetails from "./MovieDetails"
import Person from "./Person"


const Body = () => {

    const appRouter = createBrowserRouter([
        {
            path: '/',
            element: <Login />
        },
        {
            path: '/browse',
            element: <Browse />
        },
        {
            path: '/movieDetails/:movieId',
            element: <MovieDetails />
        },
        {
            path: '/person/:personId',
            element: <Person />
        },
    ])

    return (
        <div>
            <RouterProvider router={appRouter} />
        </div>
    )


}

export default Body