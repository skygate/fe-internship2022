import {
    getBaseBidNFTContractComponents,
    signTypedDataWithoutEth,
    suggestDefaultNetworks,
} from "../../../helpers";
import { useState } from "react";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { InputElement } from "../../atoms/input";
import { ButtonElement } from "../../atoms/button";

const WithdrawFromAuction = (props) => {
    const [withdrawFromAuctionTokenId, setWithdrawFromAuctionTokenId] = useState("");

    const withdrawFromAuction = async () => {
        if (props.activeAccountProps) {
            await suggestDefaultNetworks(props.activeProviderGlobalProps);
            const [contractAddress, , signer, contract] = getBaseBidNFTContractComponents(
                props.activeProviderGlobalProps
            );
            if (
                await signTypedDataWithoutEth(
                    signer, //signer
                    props.activeAccountProps, //userAddress
                    contractAddress, //contractAddress
                    `Do you want to withdraw ETH from auction of token with tokenID ${withdrawFromAuctionTokenId}?` //textMessage
                )
            ) {
                await contract
                    .withdraw(withdrawFromAuctionTokenId, {
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null,
                    })
                    .then(() => {
                        console.log(
                            `>>> You withdrawed money from auction of token with tokenID ${withdrawFromAuctionTokenId}!`
                        );
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
                    <h2>Withdraw from auction</h2>
                </CardContent>
                <CardActions>
                    <label>Token ID:</label>
                    <InputElement
                        onChange={(e) => setWithdrawFromAuctionTokenId(e.target.value)}
                        value={withdrawFromAuctionTokenId}
                        id="withdrawFromAuctionTokenId"
                        type="text"
                    ></InputElement>
                    <br />
                    <ButtonElement onClick={withdrawFromAuction} type="submit">
                        Withdraw
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default WithdrawFromAuction;
