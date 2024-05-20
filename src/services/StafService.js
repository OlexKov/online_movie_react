import axios from "axios";
import { TryError } from "../helpers/ErrorCatch";
import { formPostConfig } from "../helpers/constants";
const stafApiUrl = process.env.REACT_APP_STAF_API_URL;
export const stafService = {
    getAllStaf:() =>  TryError(() => axios.get(stafApiUrl + '/getall')),
       
    getStaf:  (id) => TryError(() => axios.get(stafApiUrl + '/get/' + id)),
       
    getStafRoles: (id) => TryError(() => axios.get(stafApiUrl + '/getroles/' + id)),

    getStafMovieRoles: (stafId,movieId) => TryError(() => axios.get(stafApiUrl + '/getmovieroles/' + stafId + '/' + movieId)),
        
    getStafMovies: (id) => TryError(() => axios.get(stafApiUrl + '/getmovies/' + id)),
       
    deleteStaf: (id) => TryError(() => axios.delete(stafApiUrl + '/delete/' + id)),
      
    createStaf : (staf) => TryError(() => axios.post(stafApiUrl + '/create', staf,formPostConfig)),
        
    updateStaf : (staf) => TryError(() => axios.put(stafApiUrl + '/update', staf,formPostConfig)),

    getStafsWithPagination: (pageSize,pageIndex) => TryError(() => axios.get(stafApiUrl + `/getstafpagination?pageSize=${pageSize}&pageIndex=${pageIndex}`)),

    setRoles: async(stafs)=>{
        await axios.all(stafs.map(x => stafService.getStafRoles(x.id)))
                .then(axios.spread((...res) => {
                    res.forEach((val, index) => {
                        stafs[index].roles = val.data;
                    })
                }));
            return stafs;
    },
   

    setMovieRoles: async(stafs,movieId)=>{
        await axios.all(stafs.map(x => stafService.getStafMovieRoles(x.id,movieId)))
                .then(axios.spread((...res) => {
                    res.forEach((val, index) => {
                        stafs[index].movieRoles = val.data;
                    })
                }));
            return stafs;
    }
}



