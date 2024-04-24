import axios from "axios";
import { TryError } from "../ErrorCatch";
import { countriesDataAPIUrl, rolesDataAPIUrl } from "../api_urls";

export const getRoles = () => {
      return TryError(() => axios.get(rolesDataAPIUrl));
}

export const getCountries = () => {
      return TryError(() => axios.get(countriesDataAPIUrl));
}