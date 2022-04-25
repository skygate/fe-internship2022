import React from "react";
import { RenderTextInput } from "components";

interface WideTextInputsProps {
    onInputChange: (e: React.ChangeEvent) => void;
}

enum TextInputTypeWide {
    ItemName,
    Description,
}

interface TextInputWide {
    name: TextInputTypeWide;
    id: string;
    label: string;
    placeholder: string;
}

const textInputWideArray: TextInputWide[] = [
    {
        name: TextInputTypeWide.ItemName,
        id: "itemName",
        label: "ITEM NAME",
        placeholder: "e.g. Redeemable Bitcoin Card with logo",
    },
    {
        name: TextInputTypeWide.Description,
        id: "itemDescription",
        label: "DESCRIPTION",
        placeholder: "e.g. After purchasing you will be available to receive the logo",
    },
];

export const WideTextInputs = ({ onInputChange }: WideTextInputsProps) => {
    return (
        <div>
            {textInputWideArray.map((item) => {
                return <RenderTextInput key={item.id} item={item} onInputChange={onInputChange} />;
            })}
        </div>
    );
};
