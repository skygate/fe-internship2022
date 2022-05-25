import style from "./auction.module.scss";
import { AuctionItem } from "interfaces/index";

interface AuctionViewProps {
    auctionData: AuctionItem | undefined;
}

export const AuctionView = ({ auctionData }: AuctionViewProps) => {
    return <div className={style.div}>{auctionData?.productID.productName}</div>;
};
