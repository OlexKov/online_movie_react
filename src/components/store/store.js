import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from '../store/userDataSlice'
import userThemeReducer from '../store/themeSlice'
import feedbackReducer from '../store/feedbackSlice'

export const store = configureStore({
       reducer: {
        user:userDataReducer,
        userTheme:userThemeReducer,
        notApprovedFeedbacks:feedbackReducer
       }
})