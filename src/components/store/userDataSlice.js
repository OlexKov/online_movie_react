import { createSlice } from '@reduxjs/toolkit';
import { getDataFromToken } from '../../helpers/methods';
import { storageService } from '../../services/StorageService';


const userDataSlice = createSlice({
    name: 'data',
    initialState: {
        data: getDataFromToken(storageService.getAccessToken())
    },
    reducers: {
        setUserData: (state, action) => {
            state.data = getDataFromToken(action.payload.token)
        },
        clearUserData: (state) => {
            state.data = null
        },
    }
})
export const { setUserData, clearUserData } = userDataSlice.actions
export default userDataSlice.reducer