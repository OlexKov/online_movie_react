import axios from "axios";
import { TryError } from "../ErrorCatch";
const apiUrl = 'http://localhost:5000/api/Movie'
const allMovieApi = apiUrl + '/getall'
const deleteMovie = apiUrl + '/delete/'
const getMovieRating = apiUrl + '/getrating/'
export const getMovies = () => {
      return TryError(() => axios.get(allMovieApi));
}

export const deleteMovies = (id) => {
      return TryError(() => axios.delete(deleteMovie + id));
}

export const getRating = (id) => {
      return TryError(() => axios.get(getMovieRating + id));
}