import React, { useEffect } from "react";
import "./App.css";
import Router from "./routes";
import { setUser } from "store/user";
import { useAppDispatch, useAppSelector } from "store/store";
import { getProfilesForLoggedUser } from "store/profile";
import { getAuctions } from "store/auctions";
import { changeActiveProfile } from "store/activeProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    return (
        <div className="App">
            <Router />
            <ToastContainer />
        </div>
    );
}

export default App;
