import style from "./auction.module.scss";
import { AuctionItem } from "interfaces/index";
import { GreenETHValue, CreatorsListItem, ProfilePicture } from "components";
import closeImg from "assets/close.svg";
import shareImg from "assets/share.svg";
import moreOptionsImg from "assets/threeDots.svg";
import heartImg from "assets/heartRed.svg";

interface AuctionViewProps {
    auctionData: AuctionItem | undefined;
    ethDolarExchange: (eth: number) => number;
}

export const AuctionView = ({ auctionData, ethDolarExchange }: AuctionViewProps) => {
    return !auctionData ? (
        <div className={style.auctionNotFound}>Auction not found</div>
    ) : (
        <div className={style.sectionContainer}>
            <img
                src={auctionData?.productID.productImageUrl}
                alt="productImage"
                className={style.productImage}
            />
            <div className={style.productInfo}>
                <h3 className={style.productName}>{auctionData.productID.productName}</h3>
                <div className={style.priceInfo}>
                    <GreenETHValue ETHValue={auctionData.price} />
                    <p className={style.dolarValue}>${ethDolarExchange(auctionData.price)}</p>
                    <p className={style.stockValue}>{auctionData.amount} in stock</p>
                </div>
                <div className={style.productDescription}>
                    {auctionData.productID.productDescription}
                </div>
                <div>
                    <h4 className={style.bids}>Bids</h4>
                    {!auctionData.bidHistory[0] ? (
                        <div className={style.noBids}>No bids</div>
                    ) : (
                        auctionData.bidHistory.map((item, index) => {
                            return (
                                <CreatorsListItem
                                    profile={item.bid.profileID}
                                    offer={item.bid.offer}
                                    key={index}
                                />
                            );
                        })
                    )}
                </div>
                <div className={style.highestBidContainer}>
                    {auctionData.bidHistory[0] ? (
                        <div className={style.bidInfo}>
                            <ProfilePicture
                                url={
                                    auctionData.bidHistory[auctionData.bidHistory.length - 1].bid
                                        .profileID.profilePicture
                                }
                                width="60px"
                            />
                            <div>
                                <p className={style.highestBid}>
                                    Highest bid by
                                    <span className={style.highestBidName}>
                                        {
                                            auctionData.bidHistory[
                                                auctionData.bidHistory.length - 1
                                            ].bid.profileID.profileName
                                        }
                                    </span>
                                </p>
                                <div className={style.cashValues}>
                                    <p className={style.bidEthValue}>
                                        ETH
                                        {
                                            auctionData.bidHistory[
                                                auctionData.bidHistory.length - 1
                                            ].bid.offer
                                        }
                                    </p>
                                    <p className={style.bidDolarValue}>
                                        $
                                        {ethDolarExchange(
                                            auctionData.bidHistory[
                                                auctionData.bidHistory.length - 1
                                            ].bid.offer
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                    <button type="button" className={style.purchaseNow}>
                        Purchase now
                    </button>
                    <button type="button" className={style.placeBid}>
                        Place a bid
                    </button>
                </div>
            </div>
            <div className={style.roundButtons}>
                <button type="button" className={style.roundBtn}>
                    <img src={shareImg} alt="" />
                </button>
                <button type="button" className={style.roundBtn}>
                    <img src={heartImg} alt="" />
                </button>
                <button type="button" className={style.roundBtn}>
                    <img src={moreOptionsImg} alt="" />
                </button>
            </div>
        </div>
    );
};
