import React, {createContext, useEffect, useState} from "react";

export const UserContext= createContext();

export const UserProvider = (props) => {
    const [token, setToken]= useState(localStorage.getItem("authToken"));

    useEffect(() => {
        const fetchUser = async () => {
            const requestOptions = {
                method: "GET" ,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };

            const response= await fetch("/users/me", requestOptions);
        
            if(!response.ok){
                setToken(null);
            }
                localStorage.setItem("authToken", token);
        };
        fetchUser();

    }, [token]);

    return (
        <UserContext.Provider value= {[token, setToken]}>
            {props.children}
        </UserContext.Provider>
    )
};