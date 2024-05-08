import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { movieService } from '../services/MovieService';
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

export const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 0);
};

export function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const setRating = async (data) => {
    await axios.all(data.map(x => movieService.getRating(x.id)))
        .then(axios.spread((...res) => {
            res.forEach((val, index) => {
                data[index].rating = val.data;
            })
        }));
    return data;
}

