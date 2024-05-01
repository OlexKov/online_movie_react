import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from '../store/userDataSlice'
export const store = configureStore({
       reducer: {
        user:userDataReducer
       }
})