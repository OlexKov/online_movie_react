import axios from "axios";
import { TryError } from "../helpers/ErrorCatch";
import { countriesDataAPIUrl, genresDataAPIUrl, premiumsDataAPIUrl, qualitiesDataAPIUrl, rolesDataAPIUrl } from "../helpers/api_urls";

export const dataService = {
       getRoles: () => TryError(() => axios.get(rolesDataAPIUrl)),

       getCountries: () => TryError(() => axios.get(countriesDataAPIUrl)),

       getQualities: () => TryError(() => axios.get(qualitiesDataAPIUrl)),

       getPremiums: () => TryError(() => axios.get(premiumsDataAPIUrl)),

       getGenres: () => TryError(() => axios.get(genresDataAPIUrl)),

}
