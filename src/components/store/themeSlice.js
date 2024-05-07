import { createSlice } from '@reduxjs/toolkit';
import { storageService } from '../../services/StorageService';


const themeSlice = createSlice({
    name: 'darkTheme',
    initialState: {
        userTheme: storageService.isDarkTheme()
    },
    reducers: {
        swithTheme: (state) => {
            state.userTheme = !state.userTheme;
            state.userTheme ? storageService.enableDarkTheme() : storageService.disableDarkTheme()
        },
    }
})
export const { swithTheme } = themeSlice.actions
export default themeSlice.reducer