import React, { useContext } from "react";
import { RenderInput } from "components";
import { FormContext } from "views/CreateSingleCollectible/CreateSingleCollectible";
import { createFormState } from "interfaces/createFormState";

interface WideTextInputsProps {
    onInputChange: (e: React.ChangeEvent) => void;
}

enum TextInputTypeWide {
    ProductName,
    ProductDescription,
}

interface TextInputWide {
    name: TextInputTypeWide;
    id: string;
    label: string;
    placeholder: string;
    value: string;
}

export const WideTextInputs = ({ onInputChange }: WideTextInputsProps) => {
    const formState: createFormState = useContext(FormContext);

    const textInputWideArray: TextInputWide[] = [
        {
            name: TextInputTypeWide.ProductName,
            id: "productName",
            label: "ITEM NAME",
            placeholder: "e.g. Redeemable Bitcoin Card with logo",
            value: formState.productName,
        },
        {
            name: TextInputTypeWide.ProductDescription,
            id: "productDescription",
            label: "DESCRIPTION",
            placeholder: "e.g. After purchasing you will be available to receive the logo",
            value: formState.productDescription,
        },
    ];
    return (
        <div>
            {textInputWideArray.map((item) => {
                return (
                    <RenderInput
                        key={item.id}
                        item={item}
                        onInputChange={onInputChange}
                        value={item.value}
                    />
                );
            })}
        </div>
    );
};
