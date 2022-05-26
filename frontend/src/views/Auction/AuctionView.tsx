import style from "./auction.module.scss";
import { AuctionItem } from "interfaces/index";
import { GreenETHValue } from "components";

interface AuctionViewProps {
    auctionData: AuctionItem | undefined;
}

export const AuctionView = ({ auctionData }: AuctionViewProps) => {
    return !auctionData ? (
        <div>Auction not found</div>
    ) : (
        <div className={style.sectionContainer}>
            <img
                src={auctionData?.productID.productImageUrl}
                alt="productImage"
                className={style.productImage}
            />
            <div className={style.productInfo}>
                <h3 className={style.productName}>{auctionData?.productID.productName}</h3>
                <div className={style.priceInfo}>
                    <GreenETHValue ETHValue={auctionData.price} />
                    {/* do poprawienia konwersja na $ */}
                    <p className={style.dolarValue}>$f3243242</p>
                    <p className={style.stockValue}>{auctionData.amount} in stock</p>
                </div>
                <div className={style.productDescription}>
                    {auctionData.productID.productDescription}
                </div>
                <div>
                    <h4 className={style.bids}>Bids</h4>
                </div>
                <div>
                    <div>
                        {/* do poprawienia ostatni bid */}
                        <img
                            src={auctionData.bidHistory[0].bid.profileID.profilePicture}
                            alt="highest bidder profile picture"
                            className={style.profilePicture}
                        />
                        <div>
                            {/* do poprawienia */}
                            <p>Highest bid by {auctionData.bidHistory[0].bid.profileID._id}</p>
                            {/* do poprawienia */}
                            <p>$2342423</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.buttons}></div>
        </div>
    );
};
