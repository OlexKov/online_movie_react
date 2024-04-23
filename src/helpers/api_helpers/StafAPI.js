import axios from "axios";
import { TryError } from "../ErrorCatch";
const apiUrl = 'http://localhost:5000/api/Staf'
const allStafApi = '/getalil'
export async function getAllStaf(){
    
    return TryError(async ()=>{await  axios.get(apiUrl + allStafApi)})
}

