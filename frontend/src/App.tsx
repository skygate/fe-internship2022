import React, { createContext, useEffect } from "react";
import "./App.css";
import Router from "./routes";
import { setUser } from "store/user";
import { useAppDispatch, useAppSelector } from "store/store";
import { getProfilesForLoggedUser } from "store/profile";
import { getAuctions } from "store/auctions";
import { changeActiveProfile } from "store/activeProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";

const socket = io("http://localhost:8080");
export const SocketContext = createContext(socket);

function App() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const { profiles } = useAppSelector((state) => state.profiles);

    useEffect(() => {
        dispatch(setUser());
    }, []);

    useEffect(() => {
        dispatch(getProfilesForLoggedUser(user.userID));
    }, [user.userID]);

    useEffect(() => {
        dispatch(getAuctions(false));
    }, []);

    useEffect(() => {
        dispatch(changeActiveProfile({ profiles: profiles, isAuto: true }));
    }, [profiles]);

    useEffect(() => {
        socket.on("auction-insert-delete", () => dispatch(getAuctions(false)));
    }, [socket]);

    return (
        <div className="App">
            <SocketContext.Provider value={socket}>
                <Router />
                <ToastContainer />
            </SocketContext.Provider>
        </div>
    );
}

export default App;
