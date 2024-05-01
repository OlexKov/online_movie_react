
const accessKey = process.env.REACT_APP_ACCESS_KEY;
const refreshKey = process.env.REACT_APP_REFRESH_KEY;

const clearSessionStorage = () =>{
    sessionStorage.removeItem(accessKey);
    sessionStorage.removeItem(refreshKey);
}

const setSessionStorage = (accessToken, refreshToken) =>{
    sessionStorage.setItem(accessKey, accessToken);
    sessionStorage.setItem(refreshKey, refreshToken);
}

const setLocalStorage = (accessToken, refreshToken) =>{
    localStorage.setItem(accessKey, accessToken);
    localStorage.setItem(refreshKey, refreshToken);
}

const clearLocalStorage = () =>{
    localStorage.removeItem(accessKey);
    localStorage.removeItem(refreshKey);
}

const isSessionStorage =  () => sessionStorage.getItem(accessKey) !== null

export const storageService = {


    saveTokens: (accessToken, refreshToken) => {
        if(isSessionStorage()){
            setSessionStorage(accessToken, refreshToken)
            clearLocalStorage();
        }
        else{
            setLocalStorage(accessToken, refreshToken)
            clearSessionStorage()
        }
    },

    getAccessToken: () =>  sessionStorage.getItem(accessKey) || localStorage.getItem(accessKey),
   
    getRefreshToken: () => sessionStorage.getItem(refreshKey) || localStorage.getItem(refreshKey),
   
    setTemporalyTokens: (accessToken, refreshToken) =>  setSessionStorage(accessToken, refreshToken),
   
    removeTokens: () => {
        clearLocalStorage()
        clearSessionStorage()
    }
}