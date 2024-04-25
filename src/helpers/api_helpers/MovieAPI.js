import axios from "axios";
import { TryError } from "../ErrorCatch";
import { allMovieAPIUrl, deleteMovieAPIUrl, movieByIdAPIUrl, movieGenresAPIUrl, movieRatingAPIUrl, movieScreensAPIUrl, movieStafsAPIUrl } from "../api_urls";

export const getMovies = () => {
      return TryError(() => axios.get(allMovieAPIUrl));
}

export const getMovie = (id) => {
      return TryError(() => axios.get(movieByIdAPIUrl + id));
}

export const deleteMovies = (id) => {
      return TryError(() => axios.delete(deleteMovieAPIUrl + id));
}

export const getRating = (id) => {
      return TryError(() => axios.get(movieRatingAPIUrl + id));
}

export const getMovieStafs = (id) => {
      return TryError(() => axios.get(movieStafsAPIUrl + id));
}

export const getMovieScreens = (id) => {
      return TryError(() => axios.get(movieScreensAPIUrl + id));
}

export const getMovieGenres = (id) => {
      return TryError(() => axios.get(movieGenresAPIUrl + id));
}