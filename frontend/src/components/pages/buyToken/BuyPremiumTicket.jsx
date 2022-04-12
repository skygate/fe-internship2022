import { getBaseERC721ContractComponents, signTypedDataWithEth } from "../../../helpers.jsx";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { ButtonElement } from "../../atoms/button";

const BuyPremiumTicket = (props) => {
    const buyPremiumToken = async () => {
        if (props.activeAccountProps) {
            const [contractAddress, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            const premiumTicketPrice = parseInt(await contract.basicTicketPrice()) * 10;
            if (
                await signTypedDataWithEth(
                    signer, //signer
                    props.activeAccountProps, //userAddress
                    contractAddress, //contractAddress
                    `Do you want to buy basic ticket for ${premiumTicketPrice / 10 ** 18} ETH?`, //textMessage
                    premiumTicketPrice / 10 ** 18, //baseCost
                    0, //adminFee
                    0 //royalitiesFee
                )
            ) {
                await contract
                    .buyPremiumTicket({ value: String(premiumTicketPrice) })
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
