import { getBaseBidNFTContractComponents, signMessageWithTxDetails } from "../../../helpers";
import { useState } from "react";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { InputElement } from "../../atoms/input";
import { ButtonElement } from "../../atoms/button";

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
