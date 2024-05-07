import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from '../store/userDataSlice'
import userThemeReducer from '../store/themeSlice'
export const store = configureStore({
       reducer: {
        user:userDataReducer,
        userTheme:userThemeReducer
       }
})