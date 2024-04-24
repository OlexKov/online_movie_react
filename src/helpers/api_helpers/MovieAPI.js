import axios from "axios";
import { TryError } from "../ErrorCatch";
import { allMovieAPIUrl, deleteMovieAPIUrl, movieRatingAPIUrl } from "../api_urls";

export const getMovies = () => {
      return TryError(() => axios.get(allMovieAPIUrl));
}

export const deleteMovies = (id) => {
      return TryError(() => axios.delete(deleteMovieAPIUrl + id));
}

export const getRating = (id) => {
      return TryError(() => axios.get(movieRatingAPIUrl + id));
}