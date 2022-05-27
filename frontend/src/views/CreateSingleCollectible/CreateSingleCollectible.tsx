import React, { useState, createContext, useEffect } from "react";
import { CreateSingleCollectibleView } from "./CreateSingleCollectibleView";
import { Product } from "interfaces/product";
import { createFormState } from "interfaces/createFormState";
import { uploadFile } from "API/UserService/uploadFile";
import { addProduct } from "API/UserService/addProduct";
import { InputFileChange } from "interfaces/file";
import { useAppSelector } from "store/store";

const defaultItem: Product = {
    ownerID: "",
    productName: "Example Name",
    productDescription: "Example description",
    productImageUrl: "https://picsum.photos/id/99/200",
    productCategory: "PNG",
};

const defaultFormState: createFormState = {
    ownerID: "",
    productName: "",
    productDescription: "",
    productImageUrl: "",
    productFormData: new FormData(),
    productCategory: "PNG",
    productSize: "",
    productProperties: "",
    putOnSale: false,
    instantSellPrice: false,
    unlockOncePurchased: false,
};

export const FormContext = createContext(defaultFormState);

export const CreateSingleCollectible = () => {
    const [formState, setFormState] = useState(defaultFormState);
    const [item, setItem] = useState<Product>(defaultItem);
    const [file, setFile] = useState<FormData>(new FormData());
    const activeProfile = useAppSelector((state) => state.activeProfile);
    useEffect(() => {
        if (activeProfile.activeProfile?._id) {
            setItem({ ...item, ownerID: activeProfile.activeProfile?._id });
            setFormState({ ...formState, ownerID: activeProfile.activeProfile?._id });
        }
    }, [file]);

    const onImgSrcChange = (arg: InputFileChange) => {
        setFormState({
            ...formState,
            productImageUrl: arg.productImageUrl,
            productFormData: arg.productFromData,
        });
        setItem({
            ...item,
            productImageUrl: arg.productImageUrl,
        });
        setFile(arg.productFromData);
    };

    const onInputChange = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement;
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
        if (formState.ownerID === "") return false;
        if (formState.productName === "") return false;
        if (formState.productDescription === "") return false;
        if (formState.productImageUrl === "") return false;
        if (formState.productCategory === "") return false;
        if (formState.productFormData === undefined) return false;
        return true;
    };

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isFormFilled = checkIfFilledForm(formState);
        if (isFormFilled) {
            const uploadImage = await uploadFile(file);
            setItem({ ...item, productImageUrl: uploadImage.data.message });
            item.productImageUrl = uploadImage.data.message;
            addProduct(item);
            onClickClear();
        }
        if (!isFormFilled) alert("Uploading failed!");
        console.log(item);
        console.log(formState);
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
