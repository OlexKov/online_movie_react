
import axios from "axios";
import { storangeService } from '../index'
import { TryError } from "../helpers/ErrorCatch";
const accountsAPIUrl = process.env.REACT_APP_ACCOUNT_API_URL;
const postBodyConfig = {
    headers: {
      'Content-Type': 'application/json'
    }}
export const accountService = {

    login: (email, password) => TryError(() => axios.post(accountsAPIUrl + '/login', { email, password },postBodyConfig)),

    isAuthenticated: () => storangeService.userData != null,

    isAdmin: () => (this.isAuthenticated() && storangeService.userData?.roles.includes('Admin')) || false,

    isUser: () => (this.isAuthenticated() && storangeService.userData?.roles.includes('User')) || false,

    getUserName: () => storangeService.userData?.name,

    getUserSurname: () => storangeService.userData?.surname,

    getUserBirthdade: () => storangeService.userData?.dateOfBirth
        .split('.')
        .reverse()
        .join('-'),

    getUserEmail: () => storangeService.userData?.email,

    getUserId: () => storangeService.userData?.id,



}
