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
           // console.log('data changed')
        },
        clearUserData: (state) => {
            state.data = null
            //console.log('data cleared')
        },
        

        // getUserName: (state) => state.data?.name,

        // getUserSurname: (state) => state.data?.surname,

        // getUserBirthdade: (state) => state.data?.dateOfBirth
        //     .split('.')
        //     .reverse()
        //     .join('-'),

        // getUserEmail: (state) => state.data?.email,

        // getUserId: (state) => state.data?.id,

    }
})
export const { setUserData, clearUserData } = userDataSlice.actions
export default userDataSlice.reducer