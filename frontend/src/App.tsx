import React from "react";
import "./App.css";
import { Footer } from "./components";
import { Banner } from "./components";
import { Navbar } from "./components";
import { TopBrandsView } from "./views";

function App() {
    return (
        <div className="App">
            <Navbar />
            <Banner />
            <TopBrandsView />
            <Footer />
        </div>
    );
}

export default App;
