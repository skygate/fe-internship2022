import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage } from "views";
import { CreateSingleCollectible } from "views";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/create" element={<CreateSingleCollectible />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
