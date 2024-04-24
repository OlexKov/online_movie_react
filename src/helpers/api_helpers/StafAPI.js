import axios from "axios";
import { TryError } from "../ErrorCatch";
const apiUrl = 'http://localhost:5000/api/Staf'
const allStafApi = apiUrl + '/getall' 
const getStafApi = apiUrl + '/get/'
const stafMovies = apiUrl + '/getmovies/'
const stafRoles = apiUrl + '/getroles/'
const stafCreate = apiUrl + '/create'
export async function getAllStaf(){
    
    return TryError(async ()=>await  axios.get(allStafApi))
}

export async function getStaf(id){
    
    return TryError(async ()=>await  axios.get(getStafApi + id))
}

export async function getStafRoles(id){
    
    return TryError(async ()=>await  axios.get(stafRoles + id))
}

export async function getStafMovies(id){
    
    return TryError(async ()=>await  axios.get(stafMovies + id))
}

export async function createStaf(staf){
    const config = {
        headers: {
            enctype:'multipart/form-data'
        },
      };
    return TryError(async ()=>await  axios.post(stafCreate,staf,config))
       
}

