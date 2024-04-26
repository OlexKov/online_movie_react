import axios from "axios";
import { TryError } from "../helpers/ErrorCatch";
import { allStafAPIUrl, createStafAPIUrl, deleteStafAPIUrl, stafByIdAPIUrl, stafMoviesAPIUrl, stafRolesAPIUrl, updateStafAPIUrl } from "../helpers/api_urls";
import { formPostConfig } from "../helpers/constants";

export const stafService = {
    getAllStaf:() =>  TryError(() => axios.get(allStafAPIUrl)),
       
    getStaf:  (id) => TryError(() => axios.get(stafByIdAPIUrl + id)),
       
    getStafRoles: (id) => TryError(() => axios.get(stafRolesAPIUrl + id)),
        
    getStafMovies: (id) => TryError(() => axios.get(stafMoviesAPIUrl + id)),
       
    deleteStaf: (id) => TryError(() => axios.delete(deleteStafAPIUrl + id)),
      
    createStaf : (staf) => TryError(() => axios.post(createStafAPIUrl, staf,formPostConfig)),
        
    updateStaf : (staf) => TryError(() => axios.put(updateStafAPIUrl, staf,formPostConfig))
   
}



