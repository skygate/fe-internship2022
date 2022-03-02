import './mainContext.css';
import Utils from '../utils/Utils';
import MintNFT from '../mintNFT/MintNFT';
import StartSale from '../startSale/StartSale';
import CancelSale from '../cancelSale/CancelSale';
import BuyToken from '../buyToken/BuyToken';
import BurnToken from '../burnToken/BurnToken';

const MainContext = (props) => {

    return (
        <div className="container">
            <div className="section1">
                <h2>Utils</h2>
                <Utils activeAccountProps = {props.activeAccountProps}/>
            </div>
            <div className="section2">
                <h2>Mint NFT</h2>
                <MintNFT activeAccountProps = {props.activeAccountProps}/>
            </div>
            <div className="section3">
                <h2>Sell NFT</h2>
                <StartSale activeAccountProps = {props.activeAccountProps}/>
            </div>
            <div className="section4">
                <h2>Cancel Sale NFT</h2>
                <CancelSale activeAccountProps = {props.activeAccountProps}/>
            </div>
            <div className="section5">
                <h2>Buy NFT</h2>
                <BuyToken activeAccountProps = {props.activeAccountProps}/>
            </div>
            <div className="section6">
                <h2>Burn NFT</h2>
                <BurnToken activeAccountProps = {props.activeAccountProps}/>
            </div>
        </div>
    );
};

export default MainContext;