import { getBaseBidNFTContractComponents, signMessageWithTxDetails } from "../../../helpers";
import { useState } from "react";

const BidAuction = (props) => {
    const [bidAuctionTokenId, setBidAuctionTokenId] = useState("");
    const [bidAuctionValue, setBidAuctionValue] = useState("");

    const bidAuction = async () => {
        if (props.activeAccountProps && bidAuctionValue !== 0) {
            const [, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to bid on token with tokenID ${bidAuctionTokenId} with ${bidAuctionValue} ETH?`
                )
            ) {
                await contract
                    .bidAuction(bidAuctionTokenId, {
                        value: bidAuctionValue.toString(),
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null,
                    })
                    .then(() => {
                        console.log(
                            `>>> You bidded ${bidAuctionValue} ETH on token auction with tokenID ${bidAuctionTokenId}!`
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
            <h2>Place bid on auction</h2>
            <label>Token ID:</label>
            <input
                onChange={(e) => setBidAuctionTokenId(e.target.value)}
                value={bidAuctionTokenId}
                id="bidAuctionTokenId"
                type="text"
            ></input>
            <br />
            <label>Bid value:</label>
            <input
                onChange={(e) => setBidAuctionValue(e.target.value)}
                value={bidAuctionValue}
                id="bidAuctionValue"
                type="text"
            ></input>
            <br />
            <button onClick={bidAuction} type="submit">
                Bid auction
            </button>
        </div>
    );
};

export default BidAuction;
