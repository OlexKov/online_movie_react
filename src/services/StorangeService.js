
const accessKey = process.env.REACT_APP_ACCESS_KEY;
const refreshKey = process.env.REACT_APP_REFRESH_KEY;

export const storangeService = {


    saveTokens: (accessToken, refreshToken) => {
        const tempAccessToken = sessionStorage.getItem(accessKey);
        if(tempAccessToken){
          sessionStorage.setItem(accessKey, accessToken);
          sessionStorage.setItem(refreshKey, refreshToken);
        }
        else{
            localStorage.setItem(accessKey, accessToken);
            localStorage.setItem(refreshKey, refreshToken);
            sessionStorage.removeItem(accessKey);
            sessionStorage.removeItem(refreshKey);
        }
    },

    getAccessToken: () => {
        const tempAccessToken = sessionStorage.getItem(accessKey);
        return tempAccessToken
            ? tempAccessToken
            : localStorage.getItem(accessKey)
    },

    getRefreshToken: () => {
        const tempRefreshToken = sessionStorage.getItem(refreshKey)
        return tempRefreshToken
            ? tempRefreshToken
            : localStorage.getItem(refreshKey)
    },

    setTemporalyTokens: (accessToken, refreshToken) => {
        sessionStorage.setItem(accessKey, accessToken);
        sessionStorage.setItem(refreshKey, refreshToken);
    },

    removeTokens: () => {
        localStorage.removeItem(accessKey);
        localStorage.removeItem(refreshKey);
        sessionStorage.removeItem(accessKey);
        sessionStorage.removeItem(refreshKey);
    }


}