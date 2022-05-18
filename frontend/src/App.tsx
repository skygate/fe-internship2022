import React, { useEffect } from "react";
import "./App.css";
import Router from "./routes";
import { setUser } from "store/user";
import { useAppDispatch, useAppSelector, RootState } from "store/store";
import { getProfilesForLoggedUser } from "store/profile";
import { getAuctions } from "store/auctions";

function App() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);

    useEffect(() => {
        dispatch(setUser());
    }, []);

    useEffect(() => {
        dispatch(getProfilesForLoggedUser(user.userID));
    }, [user.userID]);

    useEffect(() => {
        dispatch(getAuctions());
    }, []);

    return (
        <div className="App">
            <Router />
        </div>
    );
}

export default App;
