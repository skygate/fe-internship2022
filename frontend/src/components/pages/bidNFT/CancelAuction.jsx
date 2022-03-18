import { getBaseBidNFTContractComponents, signMessageWithTxDetails } from "../../../helpers";
import { useState } from "react";

const CancelAuction = (props) => {
    const [cancelAuctionTokenId, setCancelAuctionTokenId] = useState("");

    const cancelAuction = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to cancel auction of token with tokenID ${cancelAuctionTokenId}?`
                )
            ) {
                await contract
                    .cancelAuction(cancelAuctionTokenId, {
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null,
                    })
                    .then(() => {
                        console.log(
                            `>>> You cancelled auction of token with tokenID ${cancelAuctionTokenId}!`
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
            <h2>Cancel auction</h2>
            <label>Token ID:</label>
            <input
                onChange={(e) => setCancelAuctionTokenId(e.target.value)}
                value={cancelAuctionTokenId}
                id="cancelAuctionTokenId"
                type="text"
            ></input>
            <br />
            <button onClick={cancelAuction} type="submit">
                Cancel auction
            </button>
        </div>
    );
};

export default CancelAuction;
