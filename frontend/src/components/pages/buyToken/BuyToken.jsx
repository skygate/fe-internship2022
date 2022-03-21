import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { InputElement } from "../../atoms/input";
import { ButtonElement } from "../../atoms/button";
import { useState } from "react";

const BuyToken = (props) => {
    const [buyTokenId, setBuyTokenId] = useState("");
    const butToken = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            const tokenIdPrice = parseInt((await contract.tokenIdToPriceOnSale(buyTokenId))._hex);

            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to buy token with tokenID ${buyTokenId}  for ${
                        tokenIdPrice / 10 ** 18
                    } ETH?`
                )
            ) {
                await contract
                    .buyTokenOnSale(buyTokenId, { value: tokenIdPrice.toString() })
                    .then(() => {
                        console.log(
                            `>>> Token ${buyTokenId} has been bougth for ${
                                tokenIdPrice / 10 ** 18
                            } ETH!`
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
                    <h2>Buy NFT</h2>
                </CardContent>
                <CardActions>
                    <label>token ID:</label>
                    <InputElement
                        onChange={(e) => setBuyTokenId(e.target.value)}
                        value={buyTokenId}
                        id="buyTokenId"
                        type="text"
                    />
                    <br />
                    <ButtonElement onClick={butToken} type="submit">
                        Sell NFT
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default BuyToken;
