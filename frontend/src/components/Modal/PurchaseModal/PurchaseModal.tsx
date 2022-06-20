import style from "./purchaseModal.module.scss";
import { Button } from "components";
import { useAppSelector } from "store/store";
import { useState } from "react";
import { ButtonTypes } from "interfaces";
import { Navigate } from "react-router-dom";
import { editProduct, deleteAuction } from "API/UserService";
import { AuctionItem } from "interfaces/index";
import { ErrorToast, LoadingToast, UpdateToast } from "components";
import { UserSelector } from "store/user";

interface AddBidModalProps {
    onClose: () => void;
    auctionData: AuctionItem;
}

export const PurchaseModal = ({ onClose, auctionData }: AddBidModalProps) => {
    const [isPurchased, setIsPurchased] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const profile = useAppSelector((state) => state.profiles.profiles[0]);
    const user = useAppSelector(UserSelector);

    const onPurchase = async () => {
        if (user.userID === auctionData.profileID.userID) {
            ErrorToast("You can't buy from yourself");
            onClose();
            return;
        }
        const purchasingToast = LoadingToast("Purchasing...");
        setIsPurchased(true);
        const soldProduct = {
            productID: auctionData.productID._id,
            ownerID: profile._id,
        };
        await editProduct(soldProduct)
            .then()
            .catch(() => UpdateToast(purchasingToast, "Something gone wrong!", "error"));
        await deleteAuction(auctionData._id)
            .then(() => () => UpdateToast(purchasingToast, "Successfully bought item!", "success"))
            .catch(() => UpdateToast(purchasingToast, "Something gone wrong!", "error"));
        setTimeout(() => {
            setShouldRedirect(true);
        }, 2000);
    };

    return isPurchased ? (
        <div className={style.title}>
            <p className={style.titleBold}>Succesfully bought an item!</p>
            <p className={style.title}>Check your account to see it!</p>
            <p>You will be redirected to the home page.</p>
            {shouldRedirect && <Navigate to="/" />}
        </div>
    ) : (
        <div>
            <p className={style.titleQuestion}>Are you sure you want to purchase this item for</p>
            <p className={style.value}>{auctionData.price} ETH ?</p>
            <div className={style.buttons}>
                <Button text="Cancel" onClick={onClose} />
                <Button
                    type={ButtonTypes.submit}
                    text="Purchase"
                    blue={true}
                    onClick={onPurchase}
                />
            </div>
        </div>
    );
};
