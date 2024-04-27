import axios from "axios";
import { TryError } from "../helpers/ErrorCatch";
const dataAPIUrl = process.env.REACT_APP_DATA_API_URL;
export const dataService = {
       getRoles: () => TryError(() => axios.get(dataAPIUrl + '/getroles')),

       getCountries: () => TryError(() => axios.get(dataAPIUrl + '/getcountries')),

       getQualities: () => TryError(() => axios.get(dataAPIUrl + '/getqualities')),

       getPremiums: () => TryError(() => axios.get(dataAPIUrl + '/getpremiums')),

       getGenres: () => TryError(() => axios.get(dataAPIUrl + '/getgenres')),

}
