import { getBaseBidNFTContractComponents, signMessageWithTxDetails } from "../../../helpers";
import { useState } from "react";

const WithdrawFromAuction = (props) => {
    const [withdrawFromAuctionTokenId, setWithdrawFromAuctionTokenId] = useState("");

    const withdrawFromAuction = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to withdraw ETH from auction of token with tokenID ${withdrawFromAuctionTokenId}?`
                )
            ) {
                await contract
                    .withdraw(withdrawFromAuctionTokenId, {
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null,
                    })
                    .then(() => {
                        console.log(
                            `>>> You withdrawed money from auction of token with tokenID ${withdrawFromAuctionTokenId}!`
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
            <h2>Withdraw from auction</h2>
            <label>Token ID:</label>
            <input
                onChange={(e) => setWithdrawFromAuctionTokenId(e.target.value)}
                value={withdrawFromAuctionTokenId}
                id="withdrawFromAuctionTokenId"
                type="text"
            ></input>
            <br />
            <button onClick={withdrawFromAuction} type="submit">
                Withdraw
            </button>
        </div>
    );
};

export default WithdrawFromAuction;
