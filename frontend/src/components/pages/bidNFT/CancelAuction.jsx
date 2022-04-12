import { getBaseBidNFTContractComponents, signTypedDataWithoutEth } from "../../../helpers";
import { useState } from "react";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { InputElement } from "../../atoms/input";
import { ButtonElement } from "../../atoms/button";

const CancelAuction = (props) => {
    const [cancelAuctionTokenId, setCancelAuctionTokenId] = useState("");

    const cancelAuction = async () => {
        if (props.activeAccountProps) {
            const [contractAddress, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signTypedDataWithoutEth(
                    signer, //signer
                    props.activeAccountProps, //userAddress
                    contractAddress, //contractAddress
                    `Do you want to cancel auction of token with tokenID ${cancelAuctionTokenId}?` //textMessage
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
        <Grid item xs={6}>
            <Card>
                <CardContent>
                    <h2>Cancel auction</h2>
                </CardContent>
                <CardActions>
                    <label>Token ID:</label>
                    <InputElement
                        onChange={(e) => setCancelAuctionTokenId(e.target.value)}
                        value={cancelAuctionTokenId}
                        id="cancelAuctionTokenId"
                        type="text"
                    ></InputElement>
                    <br />
                    <ButtonElement onClick={cancelAuction} type="submit">
                        Cancel auction
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default CancelAuction;
