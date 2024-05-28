import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { useLocation } from 'react-router-dom';
export const getDataFromToken = (token) => {
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
            isAdmin:data['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']?.includes('Admin') || false,
            isUser:data['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']?.includes('User') || false
        }
    }
    return null
}


export const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 0);
};

export function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const uniqByKey = (array,key) => [...new Map(array.map(x=>[key(x),x])).values()]


