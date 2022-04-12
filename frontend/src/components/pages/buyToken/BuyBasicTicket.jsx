import {
    getBaseERC721ContractComponents,
    signTypedDataWithEth,
    suggestDefaultNetworks,
} from "../../../helpers.jsx";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { ButtonElement } from "../../atoms/button";

const BuyBasicToken = (props) => {
    const buyBasicToken = async () => {
        if (props.activeAccountProps) {
            await suggestDefaultNetworks(props.activeProviderGlobalProps);
            const [contractAddress, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            const basicTokenPrice = parseInt(await contract.basicTicketPrice());
            if (
                await signTypedDataWithEth(
                    signer, //signer
                    props.activeAccountProps, //userAddress
                    contractAddress, //contractAddress
                    `Do you want to buy basic ticket for ${basicTokenPrice / 10 ** 18} ETH?`, //textMessage
                    basicTokenPrice / 10 ** 18, //baseCost
                    0, //adminFee
                    0 //royaltiesFee
                )
            ) {
                await contract
                    .buyBasicTicket({ value: String(basicTokenPrice) })
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
