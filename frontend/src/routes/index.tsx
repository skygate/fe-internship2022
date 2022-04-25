import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer, Navbar } from "components";
import { LoginPage, HomePage, CreateSingleCollectible } from "views";

function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/signin" element={<LoginPage />}></Route>
        <Route path="/create" element={<CreateSingleCollectible />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default Router;
