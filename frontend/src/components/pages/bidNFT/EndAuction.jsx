import { getBaseBidNFTContractComponents, signMessageWithTxDetails } from "../../../helpers";
import { useState } from "react";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { InputElement } from "../../atoms/input";
import { ButtonElement } from "../../atoms/button";

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
        <Grid item xs={6}>
            <Card>
                <CardContent>
                    <h2>End auction</h2>
                </CardContent>
                <CardActions>
                    <label>Token ID:</label>
                    <InputElement
                        onChange={(e) => setEndAuctionTokenId(e.target.value)}
                        value={endAuctionTokenId}
                        id="endAuctionTokenId"
                        type="text"
                    ></InputElement>
                    <br />
                    <ButtonElement onClick={endAuction} type="submit">
                        End auction
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default EndAuction;
