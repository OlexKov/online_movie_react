import axios from "axios";
import { TryError } from "../ErrorCatch";
const apiUrl = 'http://localhost:5000/api/Movie'
const allMovieApi = '/getallt'
export async function getAllMovie(){
   
      return  TryError(async ()=> {await  axios.get(apiUrl + allMovieApi)});
    
}