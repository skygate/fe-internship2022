import './App.css';
import Header from './components/header/Header'
import MainContext from './components/mainContext/MainContext'
import ChooseProvider from './components/chooseProvider/ChooseProvider';
import MintNFT from './components/mintNFT/MintNFT';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, {useState} from 'react'

const App = () => { 
  const [activeAccount, setActiveAccount] = useState(null);

  return (
    <Router>
      <div className="App">
        <Header activeAccountProps = {activeAccount}/>
        <div className="content">
          <Routes>
            <Route exact path="/" element={<MainContext activeAccountProps = {activeAccount}/>}/>
            <Route path="/MintNFT" element={<MintNFT activeAccountProps = {activeAccount} />}/>
            <Route path="/login" element={<ChooseProvider changeActiveAccount ={activeAccount => setActiveAccount(activeAccount)} />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;