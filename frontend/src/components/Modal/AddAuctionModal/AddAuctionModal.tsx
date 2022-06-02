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

interface AddAuctionModalProps {
    userID: string;
    activeProfile: string;
    product: Product;
}

export const AddAuctionModal = ({ userID, activeProfile, product }: AddAuctionModalProps) => {
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
    const handleResponse = (data: AxiosResponse, errorText: string) => {
        setResponse(data.statusText);
        if (data.statusText !== errorText) formik.resetForm();
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

    const [response, setResponse] = useState<string | null>(null);
    const hideMessage = () => {
        setTimeout(() => {
            setResponse(null);
        }, 2000);
    };

    const formik: FormikValues = useFormik({
        initialValues: init,
        validationSchema,
        validateOnChange: false,
        onSubmit: async (values) => {
            await addAuction(values).then((data) => {
                handleResponse(data, "Adding auction failed!");
            });
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
