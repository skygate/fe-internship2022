import React from "react";
import "./App.css";
import { Footer } from "./components";
import { Navbar } from './components';
import { Banner } from './components';


function App() {

  return (
    <div className="App">
      <Navbar />
      <Banner />
      <Footer />
    </div>
  );
}

export default App;
