import { getBaseBidNFTContractComponents, signMessageWithTxDetails } from "../../../helpers";
import { useState } from "react";

const EndAuction = (props) => {
    const [endAuctionTokenId, setEndAuctionTokenId] = useState("");

    const endAuction = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to end auction of token with tokenID ${endAuctionTokenId}?`
                )
            ) {
                await contract
                    .endAuction(endAuctionTokenId, {
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null,
                    })
                    .then(() => {
                        console.log(
                            `>>> You ended auction of token with tokenID ${endAuctionTokenId}!`
                        );
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
            <h2>End auction</h2>
            <label>Token ID:</label>
            <input
                onChange={(e) => setEndAuctionTokenId(e.target.value)}
                value={endAuctionTokenId}
                id="endAuctionTokenId"
                type="text"
            ></input>
            <br />
            <button onClick={endAuction} type="submit">
                End auction
            </button>
        </div>
    );
};

export default EndAuction;
