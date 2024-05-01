import { jwtDecode } from 'jwt-decode';
export const getDataFromToken = (token)=>{
    if(token){
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
            ]
        }
    }
    return null
} 

export const userMethods = {
        isAuthenticated: (userData) => userData != null,

        isAdmin: (userData) => (userData != null && userData?.roles?.includes('Admin')) || false,

        isUser: (userData) => (userData != null && userData?.roles?.includes('User')) || false,
}