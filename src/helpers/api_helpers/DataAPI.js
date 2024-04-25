import axios from "axios";
import { TryError } from "../ErrorCatch";
import { countriesDataAPIUrl, genresDataAPIUrl, premiumsDataAPIUrl, qualitiesDataAPIUrl, rolesDataAPIUrl } from "../api_urls";

export const getRoles = () => {
      return TryError(() => axios.get(rolesDataAPIUrl));
}

export const getCountries = () => {
      return TryError(() => axios.get(countriesDataAPIUrl));
}

export const getQualities = () => {
      return TryError(() => axios.get(qualitiesDataAPIUrl));
}

export const getPremiums = () => {
      return TryError(() => axios.get(premiumsDataAPIUrl));
}

export const getGenres = () => {
      return TryError(() => axios.get(genresDataAPIUrl));
}