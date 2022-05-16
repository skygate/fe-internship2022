import React, { useEffect } from "react";
import "./App.css";
import Router from "./routes";
import { setUser } from "store/user";
import { useAppDispatch, useAppSelector, RootState } from "store/store";
import { getProfilesForLoggedUser } from "store/profile";

function App() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(setUser()); // !!!!!
    }, []); //path na roterze

    useEffect(() => {
        dispatch(getProfilesForLoggedUser(user.userID));
    }, [user.userID]);

    return (
        <div className="App">
            <Router />
        </div>
    );
}

export default App;
