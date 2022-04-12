import {
    getBaseBidNFTContractComponents,
    signTypedDataWithEth,
    getBaseERC721ContractComponents,
    getArtistAddress,
    getArtistAddressProof,
} from "../../../helpers";
import { useState } from "react";
import { ethers } from "ethers";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { InputElement } from "../../atoms/input";
import { ButtonElement } from "../../atoms/button";

const BidAuction = (props) => {
    const [bidAuctionTokenId, setBidAuctionTokenId] = useState("");
    const [bidAuctionValue, setBidAuctionValue] = useState("");

    const bidAuction = async () => {
        if (props.activeAccountProps && bidAuctionValue !== 0) {
            const [contractAddress, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            const [, , , contractBaseERC721] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            const adminFee = parseInt(
                await contractBaseERC721.calculateAdminFee(
                    props.activeAccountProps,
                    ethers.utils.parseEther(bidAuctionValue)
                )
            );
            const royalitiesFee = parseInt(
                await contractBaseERC721.calculateRoyaltiesFee(ethers.utils.parseEther(bidAuctionValue))
            );
            const bidAuctionValueTotalCost =
                parseInt(ethers.utils.parseEther(bidAuctionValue)) + adminFee + royalitiesFee;

            const creatorAddress = await getArtistAddress(bidAuctionTokenId);
            const addressProof = await getArtistAddressProof(bidAuctionTokenId, creatorAddress);

            if (
                await signTypedDataWithEth(
                    signer, //signer
                    props.activeAccountProps, //userAddress
                    contractAddress, //contractAddress
                    `Do you want to bid on token with tokenID ${bidAuctionTokenId} with ${bidAuctionValue} ETH with ${
                        (royalitiesFee + adminFee) / 10 ** 18
                    } ETH of fee?`, //textMessage
                    ethers.utils.parseEther(bidAuctionValue) / 10 ** 18, //baseCost
                    adminFee / 10 ** 18, //adminFee
                    royalitiesFee / 10 ** 18 //royalitiesFee
                )
            ) {
                await contract
                    .bidAuction(
                        bidAuctionTokenId,
                        ethers.utils.parseEther(bidAuctionValue),
                        creatorAddress,
                        addressProof,
                        {
                            value: bidAuctionValueTotalCost.toString(),
                            maxPriorityFeePerGas: null,
                            maxFeePerGas: null,
                        }
                    )
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
        <Grid item xs={6}>
            <Card>
                <CardContent>
                    <h2>Place bid on auction</h2>
                </CardContent>
                <CardActions>
                    <label>Token ID:</label>
                    <InputElement
                        onChange={(e) => setBidAuctionTokenId(e.target.value)}
                        value={bidAuctionTokenId}
                        id="bidAuctionTokenId"
                        type="text"
                    ></InputElement>
                    <br />
                    <label>Bid value:</label>
                    <InputElement
                        onChange={(e) => setBidAuctionValue(e.target.value)}
                        value={bidAuctionValue}
                        id="bidAuctionValue"
                        type="text"
                    ></InputElement>
                    <br />
                    <ButtonElement onClick={bidAuction} type="submit">
                        Bid auction
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default BidAuction;
