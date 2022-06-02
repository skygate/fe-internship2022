import style from "./auction.module.scss";
import { AuctionItem } from "interfaces/index";
import { GreenETHValue, CreatorsListItem, ProfilePicture, RoundButton, Button } from "components";
import { AiFillHeart } from "react-icons/ai";
import { FiShare, FiMoreHorizontal } from "react-icons/fi";
import { Toast } from "components";
import { AddBidModal } from "components/Modal";
import { Modal } from "components";
import { BidOffer } from "interfaces/bidOffer";
import { ToolsItem, ModalsVisibilityState } from "./interfaces";

interface AuctionViewProps {
    auctionData: AuctionItem | null;
    ethDolarExchange: (eth: number) => number;
    onLikeButtonClick: () => void;
    onShareButtonClick: () => void;
    onMoreInfoButtonClick: () => void;
    isAuctionLiked: boolean;
    toolsArray: ToolsItem[];
    moreOptionsDropDownRef: React.RefObject<HTMLDivElement>;
    toastMessage?: string;
    modalsVisibility: ModalsVisibilityState;
    changeModalsVisibility: (e: React.MouseEvent, modalID?: string) => void;
    placeBid: (data: BidOffer) => void;
    visibleBids: number;
    showAllBids: () => void;
}

export const AuctionView = ({
    auctionData,
    ethDolarExchange,
    onLikeButtonClick,
    onShareButtonClick,
    onMoreInfoButtonClick,
    isAuctionLiked,
    toolsArray,
    moreOptionsDropDownRef,
    toastMessage,
    modalsVisibility,
    changeModalsVisibility,
    placeBid,
    visibleBids,
    showAllBids,
}: AuctionViewProps) => {
    const { productID, price, amount, bidHistory } = auctionData || {};
    const { productImageUrl, productName, productDescription } = productID || {};
    const highestBid =
        bidHistory && bidHistory[0] ? bidHistory[bidHistory?.length - 1].bid : undefined;

    return !auctionData ? (
        <div className={style.auctionNotFound}>Auction not found</div>
    ) : (
        <div>
            <div className={style.sectionContainer}>
                <img src={productImageUrl} alt="productImage" className={style.productImage} />
                <div className={style.productInfo}>
                    <h3 className={style.productName}>{productName}</h3>
                    <div className={style.priceInfo}>
                        <GreenETHValue ETHValue={auctionData.price} />
                        <p className={style.dolarValue}>
                            ${price ? ethDolarExchange(price) : null}
                        </p>
                        <p className={style.stockValue}>{amount} in stock</p>
                    </div>
                    <div className={style.productDescription}>{productDescription}</div>
                    <div>
                        <h4 className={style.bids}>Bids</h4>
                        {bidHistory?.slice(visibleBids * -1).map((item, index) => (
                            <CreatorsListItem
                                profile={item.bid.profileID}
                                offer={item.bid.offer}
                                key={index}
                            />
                        ))}
                        {!visibleBids ? (
                            <Button text="Hide bids" id="showAllBids" onClick={showAllBids} />
                        ) : (
                            <Button text="Show all bids" id="hideBids" onClick={showAllBids} />
                        )}
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
                        <Button
                            text="Purchase now"
                            id="purchase"
                            blue={true}
                            onClick={changeModalsVisibility}
                        />
                        <Button
                            text="Place a bid"
                            id="placeBid"
                            blue={false}
                            onClick={changeModalsVisibility}
                        />
                    </div>
                </div>
                <div className={style.roundButtons}>
                    <RoundButton
                        element={<FiShare fontSize="24px" color="#777e91" />}
                        onClick={onShareButtonClick}
                        tooltip="Link copied to clipboard"
                    />
                    <RoundButton
                        element={
                            isAuctionLiked ? (
                                <AiFillHeart fontSize="24px" color="#EF466F" />
                            ) : (
                                <AiFillHeart fontSize="24px" color="#777e91" />
                            )
                        }
                        onClick={onLikeButtonClick}
                    />
                    <RoundButton
                        element={<FiMoreHorizontal fontSize="24px" color="#777e91" />}
                        onClick={onMoreInfoButtonClick}
                    />
                    <div ref={moreOptionsDropDownRef} className={style.moreOptionsDropDown}>
                        {toolsArray.map((item) => (
                            <div key={item.action} className={style.optionContainer}>
                                {item.icon}
                                <p>{item.action}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {toastMessage && <Toast message={toastMessage} />}
            <Modal
                visible={modalsVisibility.placeBid}
                title="Place bid"
                onClose={changeModalsVisibility}
            >
                <AddBidModal onPlaceBid={placeBid} onClose={changeModalsVisibility} />
            </Modal>
        </div>
    );
};
