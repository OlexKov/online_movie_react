import axios from "axios";
import { TryError } from "../ErrorCatch";
import { allStafAPIUrl, createStafAPIUrl, deleteStafAPIUrl, stafByIdAPIUrl, stafMoviesAPIUrl, stafRolesAPIUrl, updateStafAPIUrl } from "../api_urls";

const config = {
    headers: {
        enctype: 'multipart/form-data'
    },
};

export async function getAllStaf() {
    return TryError(() => axios.get(allStafAPIUrl))
}

export const getStaf = (id) => {
    return TryError(() => axios.get(stafByIdAPIUrl + id))
}

export const getStafRoles = (id) => {
    return TryError(() => axios.get(stafRolesAPIUrl + id))
}

export const getStafMovies = (id) => {
    return TryError(() => axios.get(stafMoviesAPIUrl + id))
}

export const deleteStaf = (id) => {
    return TryError(() => axios.delete(deleteStafAPIUrl + id))
}

export const createStaf = (staf) => {
    return TryError(() => axios.post(createStafAPIUrl, staf, config));
}

export const updateStaf = (staf) => {
    return TryError(() => axios.put(updateStafAPIUrl, staf, config))
}

