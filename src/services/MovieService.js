import axios from "axios";
import { TryError } from "../helpers/ErrorCatch";
import { allMovieAPIUrl, createMovieAPIUrl, deleteMovieAPIUrl, movieByIdAPIUrl, movieGenresAPIUrl, movieRatingAPIUrl, movieScreensAPIUrl, movieStafsAPIUrl, updateMovieAPIUrl } from "../helpers/api_urls";
import { formPostConfig } from "../helpers/constants";

export const movieService = {
      getMovies: () => TryError(() => axios.get(allMovieAPIUrl)),

      getMovie: (id) => TryError(() => axios.get(movieByIdAPIUrl + id)),

      deleteMovie: (id) => TryError(() => axios.delete(deleteMovieAPIUrl + id)),

      updateMovie: (movie) => TryError(() => axios.put(updateMovieAPIUrl, movie,formPostConfig)),

      createMovie: (movie) => TryError(() => axios.post(createMovieAPIUrl, movie,formPostConfig)),

      getRating: (id) => TryError(() => axios.get(movieRatingAPIUrl + id)),

      getMovieStafs: (id) => TryError(() => axios.get(movieStafsAPIUrl + id)),

      getMovieScreens: (id) => TryError(() => axios.get(movieScreensAPIUrl + id)),

      getMovieGenres: (id) => TryError(() => axios.get(movieGenresAPIUrl + id))

}

