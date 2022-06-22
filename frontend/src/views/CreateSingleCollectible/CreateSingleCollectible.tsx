import React, { useState, createContext, useEffect, useRef } from "react";
import { CreateSingleCollectibleView } from "./CreateSingleCollectibleView";
import { Product } from "interfaces/product";
import { createFormState } from "interfaces/createFormState";
import { uploadFile } from "API/UserService/uploadFile";
import { addProduct } from "API/UserService/addProduct";
import { addAuction } from "API/UserService/auctions";
import { InputFileChange } from "interfaces/file";
import { useAppSelector } from "store/store";
import { ActiveProfileSelector } from "store/activeProfile";
import { ErrorToast, LoadingToast, Toast, UpdateToast } from "components";
import { UserSelector } from "store/user";

const defaultItem: Product = {
    _id: "",
    ownerID: "",
    productName: "Example Name",
    productDescription: "Example description",
    productImageUrl:
        "https://career-lunch-storage.s3.eu-central-1.amazonaws.com/v2/blog/articles/linkedin-title-picture.jpg",
    productCategory: "art",
};

const defaultFormState: createFormState = {
    ownerID: "",
    productName: "",
    productDescription: "",
    productImageUrl: "",
    fileInputValue: "",
    productFormData: new FormData(),
    productCategory: "art",
    createAuction: false,
    putOnSale: false,
    instantSellPrice: false,
    price: 0,
    duration: 0,
};

export const FormContext = createContext(defaultFormState);

export const CreateSingleCollectible = () => {
    const [formState, setFormState] = useState(defaultFormState);
    const [item, setItem] = useState<Product>(defaultItem);
    const [productId, setProductId] = useState<string>();
    const [file, setFile] = useState<FormData>(new FormData());
    const activeProfile = useAppSelector(ActiveProfileSelector);
    const activeUser = useAppSelector(UserSelector);
    const isMounted = useRef(false);

    useEffect(() => {
        if (activeProfile.activeProfile?._id) {
            setItem({ ...item, ownerID: activeProfile.activeProfile?._id });
            setFormState({ ...formState, ownerID: activeProfile.activeProfile?._id });
        }
    }, [file]);

    const onImgSrcChange = (arg: InputFileChange) => {
        if (!arg.inputValue) return;
        setFormState({
            ...formState,
            productImageUrl: arg.productImageUrl,
            productFormData: arg.productFromData,
            fileInputValue: arg.inputValue,
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
        setFile(new FormData());
    };

    const checkIfFilledForm = () => {
        if (!formState.ownerID) return false;
        if (!formState.productName) return false;
        if (!formState.productDescription) return false;
        if (!formState.productCategory) return false;
        return true;
    };

    const checkIfAuctionFormFilled = () => {
        if (!formState.duration) return false;
        if (!formState.putOnSale && !formState.instantSellPrice) return false;
        if (formState.instantSellPrice && !formState.price) return false;
        return true;
    };

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeProfile.activeProfile) return ErrorToast("You are not logged in");
        const isFormFilled = checkIfFilledForm();
        if (!isFormFilled) return ErrorToast("Form is not filled correctly...");
        if (!formState.productFormData || !formState.productImageUrl)
            return ErrorToast("Something is wrong with image...");
        const isAuctionFormFilled = checkIfAuctionFormFilled();
        if (formState.createAuction && !isAuctionFormFilled)
            return ErrorToast("Create Auction form is not filled correctly");
        const createProductToast = LoadingToast("Creating product...");
        const uploadImage = await uploadFile(file).catch(() =>
            UpdateToast(createProductToast, "Something is wrong with image!", "error")
        );
        if (!uploadImage) return null;
        setItem({ ...item, productImageUrl: uploadImage.data.message });
        item.productImageUrl = uploadImage.data.message;

        if (!formState.createAuction) {
            await addProduct(item)
                .then(() => {
                    UpdateToast(createProductToast, "Product created successfully!", "success");
                    onClickClear();
                })
                .catch(() => UpdateToast(createProductToast, "Something went wrong", "error"));
            onClickClear();
            return;
        }

        await addProduct(item)
            .then((res) => {
                setProductId(res.data._id);
                UpdateToast(createProductToast, "Product added successfully", "success");
            })
            .catch(() =>
                UpdateToast(
                    createProductToast,
                    "Something went wrong with creating product",
                    "error"
                )
            );
    };

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        if (!productId || !activeProfile.activeProfile)
            return ErrorToast("Something went wrong with creating aution");
        const createAuctionToast = LoadingToast("Creating auction...");

        const auction = {
            userID: activeUser.userID,
            profileID: activeProfile.activeProfile._id,
            productID: productId,
            price: formState.price,
            duration: formState.duration,
        };

        addAuction(auction)
            .then(() => UpdateToast(createAuctionToast, "Auction added successfully", "success"))
            .catch(() =>
                UpdateToast(
                    createAuctionToast,
                    "Something went wrong with creating auction",
                    "error"
                )
            );
        onClickClear();
    }, [productId]);

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
