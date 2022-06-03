import { RenderInput, Button } from "components";
import { FormikValues, useFormik } from "formik";
import { ButtonTypes } from "interfaces";
import { editAuction } from "API/UserService";
const inputs = [
    {
        id: "price",
        label: "Price",
        placeholder: "Price",
        required: false,
    },
    {
        id: "amount",
        label: "Amount",
        placeholder: "Amount",
        required: false,
    },
    {
        id: "endDate",
        label: "End date",
        placeholder: "End date",
        required: false,
        type: "date",
    },
];

interface EditAuctionModalProps {
    auctionID: string;
    onClose: () => void;
}

export const EditAuctionModal = ({ auctionID, onClose }: EditAuctionModalProps) => {
    const formik: FormikValues = useFormik({
        initialValues: {
            price: "",
            amount: "",
            endDate: "",
        },
        validateOnChange: false,
        onSubmit: () => {
            const data = formik.values;
            editAuction(auctionID, data);
            onClose();
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
