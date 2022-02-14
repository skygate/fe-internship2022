import './header.css'
import { Link } from 'react-router-dom';

const Header = (props) => {
	
    return (
        <header>
            <Link to="/" className="logo">SkyTemplate</Link>
            <div className="header-right">
                {props.activeAccountProps 
                    ? (<a>Logged: {props.activeAccountProps.slice(0,7)}</a>) 
                    : (<Link to="/login">Connect Wallet</Link>)}
            </div>
            <Link to="/MintNFT">NFT</Link>
        </header>
    ); 
};

export default Header;