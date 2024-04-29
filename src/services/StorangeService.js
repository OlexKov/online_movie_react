import { jwtDecode } from "jwt-decode";
const accessKey = process.env.REACT_APP_ACCESS_KEY;
const refreshKey = process.env.REACT_APP_REFRESH_KEY;

export default class StorangeService{
    static instance = null;
    constructor(){
        if(StorangeService.instance) 
           throw  new Error("You can only create one instance!")
        else StorangeService.instance = this
        this.userData = this.getUserData() || null;
        this.tempAccessToken = null;
        this.tempRefreshToken = null;
    }

    saveTokens (accessToken, refreshToken) {
        localStorage.setItem(accessKey, accessToken);
        localStorage.setItem(refreshKey, refreshToken);
        this.setTemporalyTokens(accessToken, refreshToken)
    }

    getAccessToken () {
            return this.tempAccessToken 
            ?  this.tempAccessToken
            :  localStorage.getItem(accessKey)
        }

    getRefreshToken () {
        return this.tempRefreshToken
        ?this.tempRefreshToken
        :localStorage.getItem(refreshKey)
    }
    
    setTemporalyTokens(accessToken, refreshToken){
        this.tempAccessToken = accessToken;
        this.tempRefreshToken = refreshToken;
        this.userData = this.getUserData();
        console.log(this.userData)
    }

    removeTokens() {
        localStorage.removeItem(accessKey);
        localStorage.removeItem(refreshKey);
        this.setTemporalyTokens(null,null);
        this.userData = null;
     }

    getUserData ()  {

        const token = this.getAccessToken();
        if (token) {
            const data = jwtDecode(token);
            return {
                id: data[
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
                ],
                name: data[
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
                ],
                surname:
                    data[
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'
                    ],
                email:
                    data[
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
                    ],
                exp: data['exp'],
                iss: data['iss'],
                roles:
                    data[
                    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                    ],
                dateOfBirth:
                    data[
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth'
                    ],
            };
        }
    }
}