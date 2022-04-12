import { getBaseERC721ContractComponents, suggestDefaultNetworks } from "../../../helpers.jsx";
import { useState } from "react";
import { Grid, Card, CardContent, CardActions } from "@mui/material";
import { ButtonElement } from "../../atoms/button";
import { InputElement } from "../../atoms/input";

const TokenOwner = (props) => {
    const [ownerTokenId, setOwnerTokenId] = useState("");

    const getTokenOwner = async () => {
        if (props.activeAccountProps) {
            await suggestDefaultNetworks(props.activeProviderGlobalProps);
            const [, , , contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            await contract
                .ownerOf(ownerTokenId)
                .then((result) => {
                    console.log(`>>> Owner of token ${ownerTokenId} is: ${result}`);
                })
                .catch((error) => {
                    console.log(error.data.message);
                });
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    return (
        <Grid item xs={6}>
            <Card>
                <CardContent>
                    <h2>Get token owner</h2>
                </CardContent>
                <CardActions>
                    <InputElement
                        onChange={(e) => setOwnerTokenId(e.target.value)}
                        value={ownerTokenId}
                        id="ownerTokenId"
                        type="text"
                    ></InputElement>
                    <br />
                    <ButtonElement onClick={getTokenOwner} type="submit">
                        Get token owner
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default TokenOwner;
