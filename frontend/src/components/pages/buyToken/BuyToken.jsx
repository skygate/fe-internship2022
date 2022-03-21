import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { InputElement } from "../../atoms/input";
import { ButtonElement } from "../../atoms/button";

const BuyToken = (props) => {
    const butToken = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            const tokenId = document.getElementById("buyTokenId").value;
            const tokenIdPrice = parseInt((await contract.tokenIdToPriceOnSale(tokenId))._hex);

            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to buy token with tokenID ${tokenId}  for ${
                        tokenIdPrice / 10 ** 18
                    } ETH?`
                )
            ) {
                await contract
                    .buyTokenOnSale(tokenId, { value: tokenIdPrice.toString() })
                    .then(() => {
                        console.log(
                            `>>> Token ${tokenId} has been bougth for ${
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
                    <InputElement id="buyTokenId" type="text" />
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
