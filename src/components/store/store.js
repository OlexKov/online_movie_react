import { configureStore } from '@reduxjs/toolkit'
import userDataReducer from '../store/userDataSlice'
import feedbackReducer from '../store/feedbackSlice'

export const store = configureStore({
       reducer: {
        user:userDataReducer,
        notApprovedFeedbacks:feedbackReducer
       }
})