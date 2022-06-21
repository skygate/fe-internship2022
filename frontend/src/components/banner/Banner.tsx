import React from "react";
import { HashLink } from "react-router-hash-link";
import style from "./banner.module.scss";

export const Banner = () => {
    return (
        <section className={style.banner}>
            <p>CREATE, EXPLORE & COLLECT DIGITAL ART NFTS.</p>
            <h2>The new creative economy.</h2>
            <HashLink to="/#discover">
                <button>Start your search</button>
            </HashLink>
        </section>
    );
};
