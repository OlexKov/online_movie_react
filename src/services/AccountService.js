
import axios from "axios";
import { TryError } from "../helpers/ErrorCatch";
import { postBodyConfig } from "../helpers/constants";

const accountsAPIUrl = process.env.REACT_APP_ACCOUNT_API_URL;

export const accountService = {

    login: (email, password) => TryError(() => axios.post(accountsAPIUrl + '/login', { email, password },postBodyConfig)),
    logout: (token)=>TryError(() => axios.post(accountsAPIUrl + '/logout', {token},postBodyConfig)),
    refresh:(accessToken, refreshToken) => TryError(() => axios.post(accountsAPIUrl + '/refreshtokens', { accessToken, refreshToken },postBodyConfig)),
}
