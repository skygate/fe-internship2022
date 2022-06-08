import style from "./auction.module.scss";
import { AuctionItem } from "interfaces/index";
import { GreenETHValue, CreatorsListItem, ProfilePicture, RoundButton, Button } from "components";
import { AiFillHeart } from "react-icons/ai";
import { FiShare, FiMoreHorizontal } from "react-icons/fi";
import { Toast } from "components";
import { AddBidModal, PurchaseModal, EditAuctionModal, DeleteAuctionModal } from "components/Modal";
import { Modal } from "components";
import { BidOffer } from "interfaces/bidOffer";
import { ToolsItem, ModalsVisibilityState } from "./interfaces";
import { useAppSelector } from "store/store";
import { format } from "date-fns";

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
    changeModalsVisibility: (modalID?: string) => void;
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
    const { productID, amount, bidHistory, instantSellPrice, price, profileID } = auctionData || {};
    const { productImageUrl, productName, productDescription } = productID || {};
    const highestBid =
        bidHistory && bidHistory[0] ? bidHistory[bidHistory?.length - 1].bid : undefined;
    const profile = useAppSelector((state) => state.activeProfile.activeProfile);

    return !auctionData ? (
        <div className={style.auctionNotFound}>Auction not found</div>
    ) : (
        <div>
            <div className={style.sectionContainer}>
                <img src={productImageUrl} alt="productImage" className={style.productImage} />
                <div className={style.productInfo}>
                    <h3 className={style.productName}>{productName}</h3>
                    <div className={style.productDescription}>{productDescription}</div>
                    <div>
                        <CreatorsListItem profile={auctionData.profileID} />
                    </div>
                    <div className={style.priceInfo}>
                        <p className={style.instantSellPrice}>Cena kup teraz:</p>
                        {instantSellPrice && (
                            <p className={style.dolarValue}>${price?.toLocaleString("en-US")}</p>
                        )}
                        <p className={style.stockValue}>{amount} in stock</p>
                    </div>
                    <div className={style.auctionEndDate}>
                        <p>Koniec aukcji:</p>
                        <p>{format(new Date(auctionData.endDate), "dd/MM/yyy HH:mm")}</p>
                    </div>
                    <div>
                        {bidHistory && bidHistory.length > 0 && (
                            <h4 className={style.bids}>Bids</h4>
                        )}

                        {bidHistory?.slice(visibleBids * -1).map((item, index) => (
                            <CreatorsListItem
                                profile={item.bid.profileID}
                                offer={item.bid.offer}
                                key={index}
                            />
                        ))}
                        {bidHistory &&
                            bidHistory?.length > 2 &&
                            (!visibleBids ? (
                                <Button text="Hide bids" id="showAllBids" onClick={showAllBids} />
                            ) : (
                                <Button text="Show all bids" id="hideBids" onClick={showAllBids} />
                            ))}
                    </div>
                    <div
                        className={
                            bidHistory && bidHistory.length > 0
                                ? style.highestBidContainer
                                : style.highestBidContainerEmpty
                        }
                    >
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

                        {auctionData.instantSellPrice && (
                            <Button
                                text="Purchase now"
                                id="purchase"
                                blue={true}
                                onClick={changeModalsVisibility}
                            />
                        )}
                        {auctionData.putOnSale && (
                            <Button
                                text="Place a bid"
                                id="placeBid"
                                blue={false}
                                onClick={changeModalsVisibility}
                            />
                        )}
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
                        id="editAuction"
                        onClick={onMoreInfoButtonClick}
                    />
                    <div ref={moreOptionsDropDownRef} className={style.moreOptionsDropDown}>
                        {toolsArray
                            .filter((item) => {
                                if (profile?._id == auctionData.profileID._id) return item;
                                return item.visible === "all";
                            })
                            .map((item) => (
                                <div
                                    key={item.action}
                                    className={style.optionContainer}
                                    onClick={() => item.onClick(item.action)}
                                >
                                    {item.icon}
                                    <p>{item.label}</p>
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
            <Modal
                visible={modalsVisibility.purchase}
                title="Purchase item"
                onClose={changeModalsVisibility}
            >
                <PurchaseModal onClose={changeModalsVisibility} auctionData={auctionData} />
            </Modal>
            <Modal
                visible={modalsVisibility.editAuction}
                title="Edit item"
                onClose={changeModalsVisibility}
            >
                <EditAuctionModal auction={auctionData} onClose={changeModalsVisibility} />
            </Modal>
            <Modal
                visible={modalsVisibility.deleteAuction}
                title="Delete item"
                onClose={changeModalsVisibility}
            >
                <DeleteAuctionModal onClose={changeModalsVisibility} auctionData={auctionData} />
            </Modal>
        </div>
    );
};
