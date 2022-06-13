import style from "./deleteAuctionModal.module.scss";
import { deleteAuction } from "API/UserService";
import { Button } from "components";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "store/store";
import { AuctionItem } from "interfaces";
import { ActiveProfileSelector } from "store/activeProfile";
import { LoadingToast, UpdateToast } from "components/ToastWrapper/Toasts";

interface DeleteAuctionModalProps {
    onClose: () => void;
    auctionData: AuctionItem;
}

export const DeleteAuctionModal = ({ onClose, auctionData }: DeleteAuctionModalProps) => {
    const [isDeleted, setIsDeleted] = useState(false);
    const [shouldNavigate, setShouldNavigate] = useState(false);
    const profile = useAppSelector(ActiveProfileSelector).activeProfile;
    const onCancel = () => onClose();

    const onAuctionDelete = async () => {
        const deleteAuctionToast = LoadingToast("Editing auction...");
        try {
            if (profile?._id !== auctionData.profileID._id) throw new Error();
            await deleteAuction(auctionData._id);
            setIsDeleted(true);
            setTimeout(() => {
                setShouldNavigate(true);
            }, 2000);
            UpdateToast(deleteAuctionToast, "Successfully deleted!", "success");
        } catch (err) {
            UpdateToast(deleteAuctionToast, "Something gone wrong!", "success");
        }
    };
    return isDeleted ? (
        <div className={style.success}>
            <p>Auction was succesfully deleted</p>
            <p>You will be redirected to the Home Page</p>
            {shouldNavigate && <Navigate to="/" />}
        </div>
    ) : (
        <form className={style.form}>
            <p className={style.title}>Are you sure you want to delete this auction?</p>
            <div className={style.buttons}>
                <Button text="Yes, I want to delete" blue={true} onClick={onAuctionDelete} />
                <Button text="Cancel" onClick={onCancel} />
            </div>
        </form>
    );
};
