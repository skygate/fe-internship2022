import style from "./auction.module.scss";
import { AuctionItem } from "interfaces/index";
import { GreenETHValue, CreatorsListItem, ProfilePicture, RoundButton, Button } from "components";
import shareImg from "assets/share.svg";
import moreOptionsImg from "assets/threeDots.svg";
import heartImgRed from "assets/heartRed.svg";
import heartImgGrey from "assets/heartGrey.svg";
import { AiFillHeart } from "react-icons/ai";
import { FiShare, FiMoreHorizontal } from "react-icons/fi";

interface AuctionViewProps {
    auctionData: AuctionItem | null;
    ethDolarExchange: (eth: number) => number;
    onLikeButtonClick: (e: React.MouseEvent) => void;
}

export const AuctionView = ({
    auctionData,
    ethDolarExchange,
    onLikeButtonClick,
}: AuctionViewProps) => {
    const { productID, price, amount, bidHistory } = auctionData || {};
    const { productImageUrl, productName, productDescription } = productID || {};

    const highestBid =
        bidHistory && bidHistory[0] ? bidHistory[bidHistory?.length - 1].bid : undefined;

    const icon = <AiFillHeart />;

    return !auctionData ? (
        <div className={style.auctionNotFound}>Auction not found</div>
    ) : (
        <div className={style.sectionContainer}>
            <img src={productImageUrl} alt="productImage" className={style.productImage} />
            <div className={style.productInfo}>
                <h3 className={style.productName}>{productName}</h3>
                <div className={style.priceInfo}>
                    <GreenETHValue ETHValue={auctionData.price} />
                    <p className={style.dolarValue}>${price ? ethDolarExchange(price) : null}</p>
                    <p className={style.stockValue}>{amount} in stock</p>
                </div>
                <div className={style.productDescription}>{productDescription}</div>
                <div>
                    <h4 className={style.bids}>Bids</h4>
                    {bidHistory?.map((item, index) => (
                        <CreatorsListItem
                            profile={item.bid.profileID}
                            offer={item.bid.offer}
                            key={index}
                        />
                    ))}
                </div>
                <div className={style.highestBidContainer}>
                    {highestBid ? (
                        <div className={style.bidInfo}>
                            <ProfilePicture
                                url={highestBid.profileID.profilePicture}
                                width="60px"
                            />
                            <div>
                                <p className={style.highestBid}>
                                    Highest bid by
                                    <span className={style.highestBidName}>
                                        {highestBid.profileID.profileName}
                                    </span>
                                </p>
                                <div className={style.cashValues}>
                                    <p className={style.bidEthValue}>
                                        ETH
                                        {highestBid.offer}
                                    </p>
                                    <p className={style.bidDolarValue}>
                                        ${ethDolarExchange(highestBid?.offer)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                    <Button text="Purchase now" blue={true} />
                    <Button text="Place a bid" blue={false} />
                </div>
            </div>
            <div className={style.roundButtons}>
                <RoundButton element={<FiShare fontSize="24px" color="#777e91" />} />
                <RoundButton
                    element={<AiFillHeart fontSize="24px" color="#777e91" />}
                    onClick={onLikeButtonClick}
                />
                <RoundButton element={<FiMoreHorizontal fontSize="24px" color="#777e91" />} />
            </div>
        </div>
    );
};
