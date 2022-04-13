import React from "react";
import "./App.css";
import { Footer } from "./components";
import { Navbar } from "./components";
import { Banner } from "./components";
import { CreatorNetwork } from "./components";
import { TopBrandsView } from "./views";
import { Popular } from "./components";
import { HotBid } from "./views";

function App() {
    return (
        <div className="App">
            <Navbar />
            <Banner />
            <CreatorNetwork />
            <TopBrandsView />
            <Popular />
            <HotBid />
            <Footer />
        </div>
    );
}

export default App;
