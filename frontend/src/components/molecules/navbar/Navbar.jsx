import "./header.css";
import { Link } from "react-router-dom";

export const Navbar = (props) => {
    return (
        <header>
            <Link to="/" className="logo">
                SkyTemplate
            </Link>
            <Link to="/mintNft">Mint Token</Link>
            <Link to="/sale">Put On Sale</Link>
            <Link to="/buy">Buy Token</Link>
            <Link to="/bid">Bid Token</Link>
            <Link to="/utils">Utils</Link>
            <div className="header-right">
                {props.activeAccountProps ? (
                    <a>Logged: {props.activeAccountProps.slice(0, 7)}</a>
                ) : (
                    <Link to="/login">Connect Wallet</Link>
                )}
            </div>
        </header>
    );
};
