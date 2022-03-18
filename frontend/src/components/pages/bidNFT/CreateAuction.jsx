import { getBaseBidNFTContractComponents, signMessageWithTxDetails } from "../../../helpers";
import { useState } from "react";

const CreateAuction = (props) => {
    const [createAuctionTokenId, setCreateAuctionTokenId] = useState("");
    const [createAuctionValue, setCreateAuctionValue] = useState("");

    const createAuction = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to start bidding auction of token with tokenID ${createAuctionTokenId} with minimal price ${createAuctionValue} ETH?`
                )
            ) {
                await contract
                    .createAuction(createAuctionTokenId, createAuctionValue, {
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null,
                    })
                    .then(() => {
                        console.log(
                            `>>> You created auction of token with tokenID ${createAuctionTokenId} with minimal price ${createAuctionValue} ETH!`
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
            <h2>Create auction</h2>
            <label>Token ID:</label>
            <input
                onChange={(e) => setCreateAuctionTokenId(e.target.value)}
                value={createAuctionTokenId}
                id="createAuctionTokenId"
                type="text"
            ></input>
            <br />
            <label>Starting bid:</label>
            <input
                onChange={(e) => setCreateAuctionValue(e.target.value)}
                value={createAuctionValue}
                id="createAuctionValue"
                type="text"
            ></input>
            <br />
            <button onClick={createAuction} type="submit">
                Create auction
            </button>
        </div>
    );
};

export default CreateAuction;
