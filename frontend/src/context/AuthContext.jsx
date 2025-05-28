import { createContext, useState } from "react";
import { useEffect } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [CurrentUser, SetCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const updateUser = (data) => {
        SetCurrentUser(data)
    }

    useEffect(() => {
        localStorage.setItem("user",JSON.stringify(CurrentUser))
    

    }, [CurrentUser]);

    return (
    <AuthContext.Provider value={{ CurrentUser, updateUser }}>
        {children}
        </AuthContext.Provider>
        );
}
