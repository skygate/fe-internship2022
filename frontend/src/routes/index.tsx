import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer, Navbar } from "components";
import {
    HomePage,
    CreateSingleCollectible,
    Profile,
    Login,
    Register,
    Auction,
    Activity,
} from "views";

function Router() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/create" element={<CreateSingleCollectible />} />
                <Route path="/profile/:profileID" element={<Profile />} />
                <Route path="/auction/:auctionID" element={<Auction />} />
                <Route path="/create" element={<CreateSingleCollectible />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/activity" element={<Activity />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default Router;
