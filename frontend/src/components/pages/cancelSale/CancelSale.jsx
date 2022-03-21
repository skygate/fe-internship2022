import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { Grid, Card, CardContent, CardActions } from "@mui/material";
import { ButtonElement } from "../../atoms/button";
import { InputElement } from "../../atoms/input";
import { useState } from "react";

const CancelSale = (props) => {
    const [cancelSaleTokenId, setCancelSaleTokenId] = useState("");
    const cancelSale = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to cancel sale of token with tokenID ${cancelSaleTokenId}?`
                )
            ) {
                await contract
                    .cancelSale(cancelSaleTokenId)
                    .then(() => {
                        console.log(`>>> Token ${cancelSaleTokenId} sale has been cancelled!`);
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
                    <InputElement
                        onChange={(e) => setCancelSaleTokenId(e.target.value)}
                        value={cancelSaleTokenId}
                        id="cancelSaleTokenId"
                        type="text"
                    />
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
