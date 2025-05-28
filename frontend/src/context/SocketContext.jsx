import { createContext, useState, useEffect,useContext } from "react";
import {io} from "socket.io-client"
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketContextProvider = ({children}) => {
    const {CurrentUser} = useContext(AuthContext)
    const [Socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(io("http://localhost:4000"))
    }, []);

    useEffect(()=>{
        CurrentUser && Socket?.emit("newUser",CurrentUser.id)
    },[CurrentUser, Socket])

    return (
    <SocketContext.Provider value={{ Socket }}>
        {children}
        </SocketContext.Provider>
        );
}
