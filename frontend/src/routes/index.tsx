import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer, Navbar } from "components";
import { HomePage, CreateSingleCollectible, Login, Register } from "views";

function Router() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/create" element={<CreateSingleCollectible />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default Router;
