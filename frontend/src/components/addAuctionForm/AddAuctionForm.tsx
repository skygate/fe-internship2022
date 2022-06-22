import { RenderInput, ToggleInput, ToggleInputs } from "components";
import React, { useContext, useState } from "react";
import { FormContext } from "views/CreateSingleCollectible/CreateSingleCollectible";
import { createFormState } from "interfaces/createFormState";

const durationInput = {
    name: "Duration",
    id: "duration",
    label: "Duration",
    placeholder: "Duration in hours",
    type: "number",
};

interface AddAuctionFormProps {
    onInputChange: (e: React.ChangeEvent) => void;
    onToggleChange: (e: React.ChangeEvent) => void;
}

export const AddAuctionForm = ({ onInputChange, onToggleChange }: AddAuctionFormProps) => {
    const formState: createFormState = useContext(FormContext);

    return (
        <div>
            <ToggleInput
                id="createAuction"
                label="Create Auction"
                onChange={onToggleChange}
                checked={formState.createAuction}
            />
            {formState.createAuction && (
                <div>
                    <RenderInput
                        item={durationInput}
                        value={formState.duration}
                        onInputChange={onInputChange}
                    />
                    <ToggleInputs onToggleChange={onToggleChange} />
                    {formState.instantSellPrice && (
                        <RenderInput
                            item={{
                                id: "price",
                                label: "Price",
                                placeholder: "Price",
                                type: "number",
                            }}
                            onInputChange={onInputChange}
                            value={formState.price}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
