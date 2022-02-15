import './mainContext.css';
import StartSale from '../startSale/StartSale';

const MainContext = (props) => {

    return (
        <div className="container">
            <div className="section1">
                <h2>Mint NFT</h2>
                {/* <MintNFT /> */}
            </div>
            <div className="section2">
                <h2>Sell NFT</h2>
                <StartSale activeAccountProps = {props.activeAccountProps}/>
            </div>
            <div className="section3">
                <h2>Another feature</h2>
            </div>
        </div>
    );
};

export default MainContext;