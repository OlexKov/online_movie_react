import axios from "axios";
import { TryError } from "../ErrorCatch";
const apiUrl = 'http://localhost:5000/api/Movie'
const allMovieApi = '/getall'
export async function getMovies(){
   
      return  TryError(async ()=> await  axios.get(apiUrl + allMovieApi));
    
}