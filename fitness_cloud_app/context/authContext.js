import React, { useState, useEfect, useRef, createContext } from "react";
import jwt_decode from "jwt-decode";
import * as SecureStore from "expo-secure-store";

import ProxyService from "../services/ProxyService";


export const AuthContext = createContext();

const storeTokens = async (tokens) => {
    await SecureStore.setItemAsync('tokens', JSON.stringify(tokens));
}

const getTokens = async () => {
    tokens = await SecureStore.getItemAsync('tokens');
    return JSON.parse(tokens);
}

const clearTokens = async () => {
    SecureStore.deleteItemAsync('tokens');
}

export const AuthProvider = ({children}) => {

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [authTokens, setAuthTokens] = useState(getTokens() ? getTokens() : null);
    const [userInfo, setUserInfo] = useState();
    const [positiveRegister, setPositiveRegister] = useState(false);
    const [registerInfo, setRegisterInfo] = useState()
    const [loading, setLoading] = useState(true);


    const loginUser = async (data) => {
        return new Promise((resolve, reject) => {
            ProxyService.post('/auth/token/', {
                "username": data.username,
                "password": data.password
            })
            .then((res) => {
                setAuthTokens(res);
                storeTokens(res);
                setUserInfo(jwt_decode(res.access));
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    const registerUser = async (data) => {
        return new Promise((resolve, reject) => {
            ProxyService.post('/auth/users/', {
                "username": data.username,
                "password": data.password,
                'email': data.email,
                'first_name': data.firstName,
                'last_name': data.lastName,
                'is_coach': data.isCoach
            })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            })    
            
        })
    }

    const logoutUser = async () => {
        clearTokens();
        setUserInfo(null);
        setIsSignedIn(null);
        setAuthTokens(null);
    }

    const refreshTokens = async () => {
        return new Promise((resolve, reject) => {
            ProxyService.post('/auth/token/refresh', {
                "refresh": authTokens.refresh,
            })
            .then((res) => {
                setAuthTokens(res);
                storeTokens(res);
                setIsSignedIn(true);
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            }) 
    })
    }


    const authData = {
        isSignedIn,
        authTokens,
        userInfo,
        positiveRegister,
        registerInfo,
    }
    const authFunctions = {
        setIsSignedIn,
        loginUser,
        registerUser,
        logoutUser,
        setAuthTokens,
        setUserInfo,
        refreshTokens,
    }

    return (
        <AuthContext.Provider value={{ authData, authFunctions }}>
            {children}
        </AuthContext.Provider>

    ) 
}
