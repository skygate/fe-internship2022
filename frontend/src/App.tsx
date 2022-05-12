import React, { useEffect } from "react";
import "./App.css";
import Router from "./routes";
import { useDispatch } from "react-redux";
import { setUser } from "store/user";
import { AppDispatch } from "store/store";

function App() {
    const dispatch = useDispatch<AppDispatch>();

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
