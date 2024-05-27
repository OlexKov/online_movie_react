import { createSlice } from '@reduxjs/toolkit';

const feedbackSlice = createSlice({
    name: 'notApprovedFeedbacks',
    initialState: {
        count: 0,
    },
    reducers: {
        setNotApprovedFeedbackCount: (state, action) => {
            state.count = action.payload
        },
    }
})
export const { setNotApprovedFeedbackCount} = feedbackSlice.actions
export default feedbackSlice.reducer