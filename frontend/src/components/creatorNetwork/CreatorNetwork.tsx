import React from "react";
import homeImage from "../../assets/homeImage.png";
import arrowLeft from "../../assets/arrowLeft.svg";
import arrowRight from "../../assets/arrowRight.svg";
import style from "./creatorNetwork.module.scss";
import profilePicture from "../../assets/profilePicture.png";
import exampleImage from "../../assets/exampleImage.png";
import { ProfileHorizontal } from "../";

export const CreatorNetwork = () => {
    return (
        <section className={style.creatorNetwork}>
            <div className={style.sectionContainer}>
                <img src={homeImage} alt="Creator Network" className={style.mainImage} />
                <div>
                    <h2>the creator network&#174;</h2>
                    <div className={style.container}>
                        <ProfileHorizontal
                            upperText="Enrico"
                            bottomText="Creator"
                            imageWidth="50px"
                            imageUrl={profilePicture}
                        />
                        <ProfileHorizontal
                            upperText="Instant price"
                            bottomText="3.5 ETH"
                            imageWidth="50px"
                            imageUrl={exampleImage}
                        />
                    </div>
                    <div className={style.currentBid}>
                        <p className={style.currentBidTitle}>Current Bid</p>
                        <p className={style.ethValue}>1.00 ETH</p>
                        <p className={style.dolarValue}>$3,618.36</p>
                        <p className={style.endTime}>Auction ending in</p>
                        <div className={style.countdown}>
                            <div>
                                <p className={style.timeValue}>19</p>
                                <p className={style.timeLabel}>Hrs</p>
                            </div>
                            <div>
                                <p className={style.timeValue}>24</p>
                                <p className={style.timeLabel}>mins</p>
                            </div>
                            <div>
                                <p className={style.timeValue}>19</p>
                                <p className={style.timeLabel}>secs</p>
                            </div>
                        </div>
                    </div>
                    <div className={style.buttons}>
                        <button className={style.btnBid}>Place a bid</button>
                        <button className={style.btnView}>View item</button>
                    </div>
                    <div className={style.arrowButtons}>
                        <button className={style.arrowButton}>
                            <img src={arrowLeft} alt="left arrow" />
                        </button>
                        <button className={style.arrowButton}>
                            <img src={arrowRight} alt="right arrow" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
