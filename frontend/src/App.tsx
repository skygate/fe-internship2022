import React from "react";
import "./App.css";
import { Footer } from "./components";
import { Navbar } from "./components";
import { Banner } from "./components";
import { CreatorNetwork } from "./components";
import { HotCollections, TopBrandsView, HotBid } from "./views";
import { Popular } from "./components";

function App() {
    return (
        <div className="App">
            <Navbar />
            <Banner />
            <CreatorNetwork />
            <TopBrandsView />
            <Popular />
            <HotBid />
            <HotCollections />
            <Footer />
        </div>
    );
}

export default App;
