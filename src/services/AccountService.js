
import axios from "axios";
import { TryError } from "../helpers/ErrorCatch";
import { formPostConfig, postBodyConfig } from "../helpers/constants";

const accountsAPIUrl = process.env.REACT_APP_ACCOUNT_API_URL;

export const accountService = {

    login: (email, password) => TryError(() => axios.post(accountsAPIUrl + '/login', { email, password },postBodyConfig)),
    logout: (token)=>TryError(() => axios.post(accountsAPIUrl + '/logout', {token},postBodyConfig)),
    userRegister:(user)=>TryError(() => axios.post(accountsAPIUrl + '/user/register', user,postBodyConfig)),
    adminRegister:(user)=>TryError(() => axios.post(accountsAPIUrl + '/admin/register', user,postBodyConfig)),
    refresh:(accessToken, refreshToken) => TryError(() => axios.post(accountsAPIUrl + '/refreshtokens', { accessToken, refreshToken },postBodyConfig)),
    fogot:(email, resetPasswordPage) => TryError(() => axios.post(accountsAPIUrl + '/fogot', { email,resetPasswordPage },postBodyConfig)),
    reset:(userEmail, token,password) => TryError(() => axios.post(accountsAPIUrl + '/resetpassword', { userEmail, token,password },postBodyConfig)),
    addRemoveFavourite:(email,movieId) => TryError(() => axios.post(accountsAPIUrl + '/addremovefavourite', { email, movieId },postBodyConfig)),
    isMovieFavourite: async (movieId,userId)=> TryError(() => axios.get(`${accountsAPIUrl}/ismoviefauvorite?movieId=${movieId}&userId=${userId}`)),
    getFavourites: async (userEmail)=> TryError(() => axios.get(`${accountsAPIUrl}/getfavourites?email=${userEmail}`)),
    getPremium: async (userEmail)=> TryError(() => axios.get(`${accountsAPIUrl}/getpremium?email=${userEmail}`)),
    setUserPremium: async (userEmail,premiumId,days)=> TryError(() => axios.put(`${accountsAPIUrl}/setpremium?email=${userEmail}&premiumId=${premiumId}&days=${days}`)),
    editUser:async (data)=> TryError(() => axios.put(`${accountsAPIUrl}/edit`,data,formPostConfig)),
    deleteAccount:async (email)=> TryError(() => axios.delete(`${accountsAPIUrl}/delete?email=${email}`)),

}
