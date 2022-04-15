import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage } from "../views";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
