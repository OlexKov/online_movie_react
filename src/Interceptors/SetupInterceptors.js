import axios from 'axios';
import { message } from 'antd'
axios.defaults.baseURL = process.env.REACT_APP_SERVER_HOST 
export const SetupInterceptors = () => {
  axios.interceptors.request.use(
    config => config,
    (error) => {
      message.error(`${error.status} ${error.message}`)
      return Promise.reject(error);
    });

  axios.interceptors.response.use(
    response => response,
    (error) => {
      const status = error.response?.status || 500;
      switch (status) {

        // case 401:
        //     break; 

        default: {
          //const location =   window.location.pathname.slice(1);
          //window.location = `/error/${status}/${status}/${error.message}/${location ===''?'main':location}`;
          message.error(error.message)
          return Promise.reject(error.message);
        }
      }
    }
  );
}