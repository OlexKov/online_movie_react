import axios from 'axios';
import {message } from 'antd'
export const SetupInterceptors = () => {
    axios.interceptors.request.use((config) => {
    return config;
}, (error) => {
   
   message.error(`${error.status} ${error.message}`)
   return Promise.reject(error);
});

axios.interceptors.response.use(
    (response) => {
      
      return response.data;
    },
    ( error) => {
     
      const status = error.response?.status || 500;
      
      switch (status) {
    
        case 401:
            break; 
  
        default: {
          window.location = `/error/${status}/${status}/${error.message}`;
        // message.error(error.message)
          return Promise.reject(error.message);
        }
      }
    }
  );



}