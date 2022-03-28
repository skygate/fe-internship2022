import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { ButtonElement } from "../../atoms/button";

const BuyPremiumTicket = (props) => {
    const buyPremiumToken = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            const premiumTicketPrice = String(parseInt(await contract.basicTicketPrice()) * 10);
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to buy basic ticket for ${
                        parseInt(premiumTicketPrice) / 10 ** 18
                    } ETH?`
                )
            ) {
                await contract
                    .buyPremiumTicket({ value: premiumTicketPrice })
                    .then(() => {
                        console.log(`>>> Premium ticket has been bought!`);
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
                    <ButtonElement onClick={buyPremiumToken} type="submit">
                        Buy
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default BuyPremiumTicket;
