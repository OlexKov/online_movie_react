import axios from "axios";
import { TryError } from "../ErrorCatch";

const apiUrl = 'http://localhost:5000/api/Staf'
const allStafApi = apiUrl + '/getall'
const getStafApi = apiUrl + '/get/'
const stafMovies = apiUrl + '/getmovies/'
const stafRoles = apiUrl + '/getroles/'
const stafCreate = apiUrl + '/create'
const stafDelete = apiUrl + '/delete'
const stafUpdate = apiUrl + '/update'
const config = {
    headers: {
        enctype: 'multipart/form-data'
    },
};

export async function getAllStaf() {
    return TryError(() => axios.get(allStafApi))
}

export const getStaf = (id) => {
    return TryError(() => axios.get(getStafApi + id))
}

export const getStafRoles = (id) => {
    return TryError(() => axios.get(stafRoles + id))
}

export const getStafMovies = (id) => {
    return TryError(() => axios.get(stafMovies + id))
}

export const deleteStaf = (id) => {
    return TryError(() => axios.delete(stafDelete + id))
}

export const createStaf = (staf) => {
    return TryError(() => axios.post(stafCreate, staf, config));
}

export const updateStaf = (staf) => {
    return TryError(() => axios.put(stafUpdate, staf, config))
}

