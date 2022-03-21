import { getBaseBidNFTContractComponents, signMessageWithTxDetails } from "../../../helpers";
import { useState } from "react";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { InputElement } from "../../atoms/input";
import { ButtonElement } from "../../atoms/button";

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
        <Grid item xs={6}>
            <Card>
                <CardContent>
                    <h2>Create auction</h2>
                </CardContent>
                <CardActions>
                    <label>Token ID:</label>
                    <InputElement
                        onChange={(e) => setCreateAuctionTokenId(e.target.value)}
                        value={createAuctionTokenId}
                        id="createAuctionTokenId"
                        type="text"
                    ></InputElement>
                    <br />
                    <label>Starting bid:</label>
                    <InputElement
                        onChange={(e) => setCreateAuctionValue(e.target.value)}
                        value={createAuctionValue}
                        id="createAuctionValue"
                        type="text"
                    ></InputElement>
                    <br />
                    <ButtonElement onClick={createAuction} type="submit">
                        Create auction
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default CreateAuction;
