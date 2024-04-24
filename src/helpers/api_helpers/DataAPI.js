import axios from "axios";
import { TryError } from "../ErrorCatch";
const apiUrl = 'http://localhost:5000/api/Data'
const roles = '/getroles'
const countries = '/getcountries'
export const getRoles = () => {
      return TryError(() => axios.get(apiUrl + roles));
}

export const getCountries = () => {
      return TryError(() => axios.get(apiUrl + countries));
}