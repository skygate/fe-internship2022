import { RenderInput, Button } from "components";
import { FormikValues, useFormik } from "formik";
import { ButtonTypes } from "interfaces";
import { editAuction } from "API/UserService";
import { AuctionItem } from "interfaces";
import { format } from "date-fns";
import { LoadingToast, UpdateToast } from "components";

const inputs = [
    {
        id: "price",
        label: "Price",
        placeholder: "Price",
        required: false,
    },
    {
        id: "endDate",
        label: "End date",
        placeholder: "End date",
        required: false,
        type: "datetime-local",
    },
];

interface EditAuctionModalProps {
    auction: AuctionItem;
    onClose: () => void;
}

export const EditAuctionModal = ({ auction, onClose }: EditAuctionModalProps) => {
    const endDate = new Date(auction.endDate);
    const formatedEndDate = `${format(endDate, "yyyy-MM-dd")}T${format(endDate, "HH:mm")}`;
    const formik: FormikValues = useFormik({
        initialValues: {
            price: auction.price,
            amount: auction.amount,
            endDate: formatedEndDate,
        },
        validateOnChange: false,
        onSubmit: async () => {
            const editAuctionToast = LoadingToast("Editing auction...");
            const data = { ...formik.values, endDate: new Date(formik.values.endDate) };
            await editAuction(auction._id, data)
                .then(() => {
                    UpdateToast(editAuctionToast, "Successfully edited!", "success");
                })
                .catch((err) =>
                    UpdateToast(editAuctionToast, `Something gone wrong! ${err.message}`, "error")
                )
                .finally(() => onClose());
        },
    });

    return (
        <form onSubmit={(e) => formik.handleSubmit(e)}>
            {inputs.map((item) => (
                <RenderInput
                    item={item}
                    onInputChange={formik.handleChange}
                    value={formik.values[item.id]}
                />
            ))}
            <div>
                <Button type={ButtonTypes.submit} text="Edit auction" blue={true} />
                <Button text="Cancel" onClick={onClose} />
            </div>
        </form>
    );
};
