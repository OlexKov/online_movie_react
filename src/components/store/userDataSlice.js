import { createSlice } from '@reduxjs/toolkit';
import { getDataFromToken,} from '../../helpers/methods';
import { storageService } from '../../services/StorageService';


const userDataSlice = createSlice({
    name: 'data',
    initialState: {
        data: getDataFromToken(storageService.getAccessToken()),
        userTheme: storageService.isDarkTheme()
       
    },
    reducers: {
        setUserData: (state, action) => {
            state.data = getDataFromToken(action.payload.token)
        },
        clearUserData: (state) => {
            state.data = null
        },
        swithTheme: (state) => {
            state.userTheme = !state.userTheme;
            state.userTheme ? storageService.enableDarkTheme() : storageService.disableDarkTheme()
        },
    }
})
export const { setUserData, clearUserData,swithTheme} = userDataSlice.actions
export default userDataSlice.reducer