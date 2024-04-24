import axios from "axios";
import { TryError } from "../ErrorCatch";
const apiUrl = 'http://localhost:5000/api/Data'
const roles = '/getroles'
const countries = '/getcountries'
export async function getRoles(){
   
      return  await axios.get(apiUrl + roles);
    
}

export async function getCountries(){
   
      return  await axios.get(apiUrl + countries);
    
}