import { Link } from "react-router-dom";
import style from "./navbar.module.scss";
import logo from "assets/logo.svg";
import magnifierIcon from "assets/magnifier.svg";

export const Navbar = () => {
    return (
        <header>
            <Link to="/">
                <div className={style.logo}>
                    <img src={logo} alt="logo" />
                </div>
            </Link>
            <div className={style.searchInput}>
                <label htmlFor="search" className={style.label}>
                    <img src={magnifierIcon} alt="Magnifier icon" />
                </label>
                <input
                    type="text"
                    id={style.search}
                    placeholder="Search in Collections, Items, Creators"
                />
            </div>
            <nav>
                <ul>
                    <li className={style.navItem}>
                        <a href="/">Discover</a>
                    </li>
                    <li className={style.navItem}>
                        <a href="/">Activity</a>
                    </li>
                    <li className={style.navItem}>
                        <a href="/">Resources</a>
                    </li>
                </ul>
            </nav>
            <Link to="/create" style={{ textDecoration: "none" }}>
                <button className={style.btnCreate}>Create</button>
            </Link>
            <button className={style.btnWallet}>Wallet</button>
        </header>
    );
};
