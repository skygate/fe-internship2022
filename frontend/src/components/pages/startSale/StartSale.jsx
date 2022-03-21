import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { ethers } from "ethers";
import { Grid, Card, CardContent, CardActions } from "@mui/material";
import { ButtonElement } from "../../atoms/button";
import { InputElement } from "../../atoms/input";

const StartSale = (props) => {
    const startSale = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );
            const tokenId = document.getElementById("sellTokenId").value;
            const price = ethers.utils.parseEther(document.getElementById("sellTokenPrice").value);
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to start sale of token with tokenId ${tokenId} for price ${
                        price / 10 ** 18
                    } ETH?`
                )
            ) {
                await contract
                    .startSale(tokenId, price)
                    .then(() => {
                        console.log(
                            `>>> Token ${tokenId} has been put on sale for ${price / 10 ** 18} ETH!`
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
                    <h2>Sell NFT</h2>
                </CardContent>
                <CardActions>
                    <label>token ID:</label>
                    <InputElement id="sellTokenId" type="text" />
                    <br />
                    <label>ETH price: </label>
                    <InputElement id="sellTokenPrice" type="text"></InputElement>
                    <br />
                    <ButtonElement onClick={startSale} type="submit">
                        Sell NFT
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default StartSale;
