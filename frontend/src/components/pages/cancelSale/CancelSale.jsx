import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { Grid, Card, CardContent, CardActions } from "@mui/material";
import { ButtonElement } from "../../atoms/button";
import { InputElement } from "../../atoms/input";

const CancelSale = (props) => {
    const cancelSale = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );
            const tokenId = document.getElementById("cancelSaleId").value;
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to cancel sale of token with tokenID ${tokenId}?`
                )
            ) {
                await contract
                    .cancelSale(tokenId)
                    .then(() => {
                        console.log(`>>> Token ${tokenId} sale has been cancelled!`);
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
                    <h2>Cancel Sale NFT</h2>
                </CardContent>
                <CardActions>
                    <label>token ID:</label>
                    <InputElement id="cancelSaleId" type="text" />
                    <br />
                    <ButtonElement onClick={cancelSale} type="submit">
                        Cancel Sale NFT
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default CancelSale;
