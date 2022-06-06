import styles from "./AddAuctionModal.module.scss";
import { RenderInput } from "components";
import { useState } from "react";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import { AddAuctionInputsArray } from "./AddAuctionInputsArray";
import { AxiosResponse } from "axios";
import { Product } from "interfaces/product";
import { addAuction } from "API/UserService/auctions";
import { ToggleInputs } from "components/toggleInputs/ToggleInputs";
import { toast } from "react-toastify";
import { useAppDispatch } from "store/store";
import { fetchUserProducts } from "store/userProducts";

interface AddAuctionModalProps {
    userID: string;
    activeProfile: string;
    product: Product;
    isVisible: () => void;
}

export const AddAuctionModal = ({
    userID,
    activeProfile,
    product,
    isVisible,
}: AddAuctionModalProps) => {
    const [response, setResponse] = useState<string | null>(null);
    const hideMessage = () => {
        setTimeout(() => {
            setResponse(null);
        }, 2000);
    };
    const dispatch = useAppDispatch();

    const init = {
        userID: userID,
        profileID: activeProfile,
        productID: product._id,
        amount: 0,
        price: 0,
        duration: 0,
        putOnSale: false,
        instantSellPrice: false,
    };

    const AddAuctionWithToast = async (values: any) => {
        const id = toast.loading("Starting new auction...");
        try {
            await addAuction(values);
            formik.resetForm();
            isVisible();
            toast.update(id, {
                render: "New auction started!",
                type: "success",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            });
            dispatch(fetchUserProducts(activeProfile));
        } catch {
            toast.update(id, {
                render: "Something went wrong",
                type: "error",
                isLoading: false,
                autoClose: 2500,
                closeOnClick: true,
            });
        }
    };

    const validationSchema = Yup.object().shape({
        profileID: Yup.string()
            .min(4, "Must be min 4 characters")
            .max(255, "You can use max 255 characters")
            .required("Required"),
        productID: Yup.string().min(3, "Must be min 3 characters"),
        amount: Yup.number().min(0.9, "You must set minimum 1 product"),
        price: Yup.number(),
        duration: Yup.number().min(0.9, "You must set minimum 1 hour duration"),
        putOnSale: Yup.boolean(),
        instantPrice: Yup.boolean(),
    });

    const formik: FormikValues = useFormik({
        initialValues: init,
        validationSchema,
        validateOnChange: false,
        onSubmit: (values) => {
            AddAuctionWithToast(values);
            setResponse(null);
            hideMessage();
        },
    });

    return (
        <form action="" className={styles.form} onSubmit={formik.handleSubmit} noValidate>
            {AddAuctionInputsArray.map((item) => (
                <RenderInput
                    key={item.id}
                    item={item}
                    onInputChange={formik.handleChange}
                    value={formik.values[item.name]}
                    error={formik.errors[item.id]}
                />
            ))}
            <ToggleInputs onToggleChange={formik.handleChange} />
            {formik.values.instantSellPrice && (
                <RenderInput
                    item={{
                        id: "price",
                        label: "Price",
                        placeholder: "Price",
                        type: "number",
                    }}
                    onInputChange={formik.handleChange}
                    value={formik.values.Price}
                    error={formik.errors.price}
                />
            )}
            <button type="submit" className={styles.submitButton}>
                Add new auction!
            </button>
            {response ? <span className={styles.response}>{response}</span> : null}
        </form>
    );
};