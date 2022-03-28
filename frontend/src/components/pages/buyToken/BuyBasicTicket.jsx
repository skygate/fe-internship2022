import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { ButtonElement } from "../../atoms/button";

const BuyBasicToken = (props) => {
    const buyBasicToken = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            const basicTokenPrice = await contract.basicTicketPrice();
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to buy basic ticket for ${
                        parseInt(basicTokenPrice) / 10 ** 18
                    } ETH?`
                )
            ) {
                await contract
                    .buyBasicTicket({ value: basicTokenPrice })
                    .then(() => {
                        console.log(`>>> Basic ticket has been bought!`);
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
                    <h2>Buy basic ticket</h2>
                </CardContent>
                <CardActions>
                    <ButtonElement onClick={buyBasicToken} type="submit">
                        Buy
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default BuyBasicToken;
