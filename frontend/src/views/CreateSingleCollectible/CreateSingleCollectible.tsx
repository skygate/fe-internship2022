import React, { useState, createContext } from "react";
import { CreateSingleCollectibleView } from "./CreateSingleCollectibleView";
import { Product } from "interfaces/product";
import { createFormState } from "interfaces/createFormState";

const defaultItem: Product = {
    productId: null,
    productName: "Example Name",
    productDescription: "Example description",
    productImageUrl: "https://picsum.photos/id/99/200",
    productCategory: "PNG",
};

const defaultFormState: createFormState = {
    productId: null,
    productName: "",
    productDescription: "",
    productImageUrl: "",
    productCategory: "",
    productSize: "",
    productProperties: "",
    putOnSale: false,
    instantSellPrice: false,
    unlockOncePurchased: false,
};

const SEND_FORM_URL = "http://localhost:8000/products";
export const FormContext = createContext(defaultFormState);

export const CreateSingleCollectible = () => {
    const [formState, setFormState] = useState(defaultFormState);
    const [item, setItem] = useState<Product>(defaultItem);

    const onImgSrcChange = (arg: string) => {
        setFormState({ ...formState, productImageUrl: arg });
        setItem({ ...item, productImageUrl: arg });
    };

    const onInputChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        console.log(target.id);
        setFormState({ ...formState, [target.id]: target.value });
        setItem({ ...item, [target.id]: target.value });
    };

    const onToggleChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        setFormState({ ...formState, [target.id]: target.checked });
        setItem({ ...item, [target.id]: target.checked });
    };

    const onClickClear = () => {
        setItem(defaultItem);
        setFormState(defaultFormState);
    };

    const checkIfFilledForm = (formState: createFormState) => {
        if (formState.productName === "") return false;
        if (formState.productDescription === "") return false;
        if (formState.productImageUrl === "") return false;
        if (formState.productCategory === "") return false;
        return true;
    };

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isFormFilled = checkIfFilledForm(formState);
        if (isFormFilled) {
            await fetch(SEND_FORM_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            alert("wysłano");
        }
        if (!isFormFilled) alert("nie wyslano");

        setFormState(defaultFormState);
    };

    return (
        <FormContext.Provider value={formState}>
            <CreateSingleCollectibleView
                onInputChange={onInputChange}
                onToggleChange={onToggleChange}
                onImgSrcChange={onImgSrcChange}
                item={item}
                onClickClear={onClickClear}
                onFormSubmit={onFormSubmit}
            />
        </FormContext.Provider>
    );
};
