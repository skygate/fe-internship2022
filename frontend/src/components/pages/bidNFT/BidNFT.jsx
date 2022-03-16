import { getBaseBidNFTContractComponents, signMessageWithTxDetails } from "../../../helpers";
import { ethers } from "ethers";

const BidNFT = (props) => {
    const createAuctionNFT = async () => {
        const tokenId = document.getElementById("tokenID").value;
        const _startingBid = document.getElementById("AuctionStartBidPrice").value;

        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to start bidding auction of token with tokenID ${tokenId} with minimal price ${_startingBid} ETH?`
                )
            ) {
                await contract
                    .createAuction(tokenId, _startingBid, {
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null,
                    })
                    .then(() => {
                        console.log(`>>> Actual ${tokenId} is on Auction!`);
                    })
                    .catch((error) => {
                        console.log(error.data.message);
                    });
            }
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    const bidAuctionNFT = async () => {
        const tokenId = document.getElementById("tokenID").value;
        const auctionBid = ethers.utils.parseEther(document.getElementById("AuctionBid").value);

        if (props.activeAccountProps && auctionBid !== 0) {
            const [, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to bid on token with tokenID ${tokenId} with ${auctionBid} ETH?`
                )
            ) {
                await contract
                    .bidAuction(tokenId, {
                        value: auctionBid.toString(),
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null,
                    })
                    .then(() => {
                        console.log(`>>> Actual ${tokenId} is bid up now!`);
                    })
                    .catch((error) => {
                        console.log(error.data.message);
                    });
            }
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    const withdrawNFT = async () => {
        const tokenId = document.getElementById("tokenID").value;

        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to withdraw ETH from auction of token with tokenID ${tokenId}?`
                )
            ) {
                await contract
                    .withdraw(tokenId, {
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null,
                    })
                    .then(() => {
                        console.log(`>>> Actual you withdraw money from ${tokenId} Auction!`);
                    })
                    .catch((error) => {
                        console.log(error.data.message);
                    });
            }
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    const cancelAuctionNFT = async () => {
        const tokenId = document.getElementById("tokenID").value;

        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to cancel auction of token with tokenID ${tokenId}?`
                )
            ) {
                await contract
                    .cancelAuction(tokenId, {
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null,
                    })
                    .then(() => {
                        console.log(`>>> Actual Auction ${tokenId} is Cancel!`);
                    })
                    .catch((error) => {
                        console.log(error.data.message);
                    });
            }
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    const endAuctionNFT = async () => {
        const tokenId = document.getElementById("tokenID").value;

        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to end auction of token with tokenID ${tokenId}?`
                )
            ) {
                await contract
                    .endAuction(tokenId, {
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null,
                    })
                    .then(() => {
                        console.log(`>>> Actual Auction ${tokenId} is End!`);
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
        <div>
            <h2>BidNFT NFT</h2>
            <h3>Auction</h3>
            <span>Token ID:</span>
            <input id="tokenID" type="text"></input>
            <br />
            <span>Minimal token price:</span>
            <input id="AuctionStartBidPrice" type="text"></input>
            <br />
            <button onClick={createAuctionNFT} type="submit">
                Create
            </button>
            <span>Bid send on contract:</span>
            <input id="AuctionBid" type="text"></input>
            <br />
            <button onClick={bidAuctionNFT} type="submit">
                Bid in ETH
            </button>
            <button onClick={withdrawNFT} type="submit">
                Withdraw Money
            </button>
            <button onClick={cancelAuctionNFT} type="submit">
                Cancel
            </button>
            <button onClick={endAuctionNFT} type="submit">
                End
            </button>
        </div>
    );
};

export default BidNFT;
