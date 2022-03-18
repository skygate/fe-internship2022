import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { useState } from "react";

const BurnToken = (props) => {
    const [burnTokenId, setBurnTokenId] = useState("");
    const burnToken = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to burn token with tokenID ${burnTokenId}?`
                )
            ) {
                await contract
                    .burn(burnTokenId)
                    .then(() => {
                        console.log(`>>> Token ${burnTokenId} has been burned!`);
                    })
                    .catch((error) => {
                        console.log(error.data.message);
                    });
            }
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    return (
        <div className="center">
            <h2>Burn NFT</h2>
            <div>
                <label>token ID:</label>
                <input
                    onChange={(e) => setBurnTokenId(e.target.value)}
                    value={burnTokenId}
                    id="burnTokenId"
                    type="text"
                ></input>
                <br />
                <button onClick={burnToken} type="submit">
                    Burn NFT
                </button>
            </div>
        </div>
    );
};

export default BurnToken;