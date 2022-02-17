import './mainContext.css';
import Utils from '../utils/Utils';
import StartSale from '../startSale/StartSale';
import BuyToken from '../buyToken/BuyToken';

const MainContext = (props) => {

    return (
        <div className="container">
            <div className="section1">
                <h2>Utils</h2>
                <Utils activeAccountProps = {props.activeAccountProps}/>
            </div>
            <div className="section2">
                <h2>Mint NFT</h2>
                {/* <MintNFT /> */}
            </div>
            <div className="section3">
                <h2>Sell NFT</h2>
                <StartSale activeAccountProps = {props.activeAccountProps}/>
            </div>
            <div className="section4">
                <h2>Buy NFT</h2>
                <BuyToken activeAccountProps = {props.activeAccountProps}/>
            </div>
        </div>
    );
};

export default MainContext;