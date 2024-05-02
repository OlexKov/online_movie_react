import axios from 'axios';
import { message } from 'antd'
import { storageService } from '../services/StorageService';
import { accountService } from '../services/AccountService';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_HOST
export const SetupInterceptors = () => {
  axios.interceptors.request.use(
    async config => {
      config.headers = {
        'Authorization': `Bearer ${storageService.getAccessToken()}`,
      }
      return config
    },
    async (error) => {

      message.error(`${error.status} ${error.message}`)
      return Promise.reject(error);
    });

  axios.interceptors.response.use(
    async response => response,
    async (error) => {
      const status = error.response?.status || 500;
      switch (status) {
        case 401: {
          const originalRequest = error.config;
          if (!originalRequest.url?.includes('refreshtokens') && !originalRequest._retry) {
            const responce = await accountService.refresh(storageService.getAccessToken(), storageService.getRefreshToken())
            storageService.saveTokens(responce.data.accessToken, responce.data.refreshToken)
            originalRequest._retry = true;
            if (originalRequest.url?.includes('logout')) {
              originalRequest.data = { token: responce.data.refreshToken }
            }
            originalRequest.headers = {
              'Authorization': `Bearer ${responce.data.accessToken}`,
              'Content-type': 'application/json'
            }
            return axios(originalRequest);
          }
          else {
            storageService.removeTokens();
            window.history.push('/login')
          }
        }
          break;


        default: {
       //  const location = window.location.pathname.slice(1);
        //  window.location = `/error?status=${status}&title=${status}&subTitle=${error.message}&location=${location === '' ? 'main' : 'notmain'}`;
          message.error(error.message)
          if (error.response.data) {
            if (error.response.data.message)
              message.error(error.response.data.message)
            else if (error.response.data.length > 0) {
              error.response.data.forEach(element => {
                message.error(element.ErrorMessage)
              });

            }
          }

          return Promise.reject(error.message);
        }
      }
    }
  );
}