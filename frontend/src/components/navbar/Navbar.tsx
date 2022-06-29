import { Link, useNavigate } from "react-router-dom";
import style from "./navbar.module.scss";
import logo from "assets/logo.svg";
import { NavbarDropDown, ProfileHorizontal } from "components";
import magnifierIcon from "assets/magnifier.svg";
import { useAppSelector } from "store/store";
import { HashLink } from "react-router-hash-link";
import { getSearchResults } from "API/UserService";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

export const Navbar = () => {
    const user = useAppSelector((state) => state.user);
    const navigate = useNavigate();
    const checkLink = () => {
        if (window.location.search) return;
        return navigate("/");
    };

    interface Result {
        object: string;
        picture: string;
        name: string;
        linkTo: string;
    }
    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState<Result[]>();
    const flag = useRef(false);

    useEffect(() => {
        if (!flag.current) {
            flag.current = true;
            return;
        }
        if (searchText.length < 3) {
            setResults([]);
            return;
        }
        getSearchResults({ searchText: searchText }).then((data) => setResults(data));
    }, [searchText]);

    const debouncedSearch = debounce(async (data) => {
        setSearchText(data);
    }, 500);

    const onSearch = (e: { target: HTMLInputElement }) => {
        debouncedSearch(e.target.value);
    };

    return (
        <header>
            <div className={style.logo} onClick={() => checkLink()}>
                <img src={logo} alt="logo" />
            </div>
            <div className={style.searchInput}>
                <label htmlFor="search" className={style.label}>
                    <img src={magnifierIcon} alt="Magnifier icon" />
                </label>
                <input
                    type="text"
                    id={style.search}
                    placeholder="Search in Items, Creators"
                    onChange={onSearch}
                    className={style.input}
                />
                <div className={style.results}>
                    {results && results?.length > 0 ? (
                        results.map((item) => (
                            <ProfileHorizontal
                                key={item.name}
                                upperText={item.name}
                                bottomText={item.object}
                                imageUrl={item.picture}
                                imageWidth="50px"
                                linkTo={item.linkTo}
                            />
                        ))
                    ) : (
                        <p>Search for items. Put min. 3 characters</p>
                    )}
                </div>
            </div>
            <nav>
                <ul>
                    <HashLink to="/#discover">
                        <li className={style.navItem}>Discover</li>
                    </HashLink>
                    <Link to="/activity">
                        <li className={style.navItem}>Activity</li>
                    </Link>
                    <li className={style.navItem}>
                        <a href="/">Resources</a>
                    </li>
                </ul>
            </nav>
            <Link to="/create" style={{ textDecoration: "none" }}>
                <button className={style.btnCreate}>Create</button>
            </Link>
            {user.userID === "" ? (
                <Link to="/login">
                    <button className={style.btnWallet}>Log in</button>
                </Link>
            ) : (
                <NavbarDropDown />
            )}
        </header>
    );
};
