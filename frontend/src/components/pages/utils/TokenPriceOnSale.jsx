import { getBaseERC721ContractComponents } from "../../../helpers.jsx";
import { useState } from "react";
import { Grid, Card, CardContent, CardActions } from "@mui/material";
import { ButtonElement } from "../../atoms/button";
import { InputElement } from "../../atoms/input";

const TokenPriceOnSale = (props) => {
    const [tokenOnSaleTokenId, setTokenOnSaleTokenId] = useState("");
    const getTokenPrice = async () => {
        if (props.activeAccountProps) {
            const [, , , contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            await contract
                .tokenIdToPriceOnSale(tokenOnSaleTokenId)
                .then((result) => {
                    if (parseInt(result._hex) === 0) {
                        console.log(`>>> Token ${tokenOnSaleTokenId} is not for sale!`);
                    } else {
                        console.log(
                            `>>> Token ${tokenOnSaleTokenId} costs: ${parseInt(result._hex)}`
                        );
                    }
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
                    <h2>Get token price on sale</h2>
                </CardContent>
                <CardActions>
                    <InputElement
                        onChange={(e) => setTokenOnSaleTokenId(e.target.value)}
                        value={tokenOnSaleTokenId}
                        id="tokenOnSaleTokenId"
                        type="text"
                    ></InputElement>
                    <br />
                    <ButtonElement onClick={getTokenPrice} type="submit">
                        Get token price
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default TokenPriceOnSale;
