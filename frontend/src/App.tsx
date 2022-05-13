import React, { useEffect } from "react";
import "./App.css";
import Router from "./routes";
import { setUser } from "store/user";
import { useAppDispatch } from "store/store";

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setUser()); // !!!!!
    }, []); //path na roterze

    return (
        <div className="App">
            <Router />
        </div>
    );
}

export default App;
