import { getBaseERC721ContractComponents, suggestDefaultNetworks } from "../../../helpers.jsx";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { ButtonElement } from "../../atoms/button";
import { PriceFeedProxyLocalHost } from "../../../constant/index";

const PriceFeeds = (props) => {
    const getPriceFeeds = async (dataFeedPair) => {
        if (props.activeAccountProps) {
            await suggestDefaultNetworks(props.activeProviderGlobalProps);
            const [, , , contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            await contract
                .getLatestPrice(PriceFeedProxyLocalHost[dataFeedPair])
                .then((result) => {
                    console.log(`>>> ${dataFeedPair}: ${result}`);
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
                    <h2>Get price feed</h2>
                </CardContent>
                <CardActions>
                    <ButtonElement onClick={() => getPriceFeeds("ETH/USD")} type="submit">
                        ETH/USD
                    </ButtonElement>
                    <ButtonElement onClick={() => getPriceFeeds("BTC/USD")} type="submit">
                        BTC/USD
                    </ButtonElement>
                    <ButtonElement onClick={() => getPriceFeeds("LINK/USD")} type="submit">
                        LINK/USD
                    </ButtonElement>
                    <ButtonElement onClick={() => getPriceFeeds("DAI/USD")} type="submit">
                        DAI/USD
                    </ButtonElement>
                    <ButtonElement onClick={() => getPriceFeeds("BNB/USD")} type="submit">
                        BNB/USD
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default PriceFeeds;
