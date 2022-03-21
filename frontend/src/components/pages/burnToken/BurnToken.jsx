import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { useState } from "react";
import { InputElement } from "../../atoms/input";
import { ButtonElement } from "../../atoms/button";
import { Card, Grid, CardActions, CardContent } from "@mui/material";

const BurnToken = (props) => {
    const [burnTokenId, setBurnTokenId] = useState("");
    const burnToken = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to burn token with tokenID ${burnTokenId}?`
                )
            ) {
                await contract
                    .burn(burnTokenId)
                    .then(() => {
                        console.log(`>>> Token ${burnTokenId} has been burned!`);
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
                    <h2>Burn NFT</h2>
                </CardContent>

                <CardActions>
                    <label>token ID:</label>
                    <InputElement
                        onChange={(e) => setBurnTokenId(e.target.value)}
                        value={burnTokenId}
                        id="burnTokenId"
                        type="text"
                    />
                    <br />
                    <ButtonElement onClick={burnToken}>Burn NFT</ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default BurnToken;
