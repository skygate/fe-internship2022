import {
    getBaseERC721ContractComponents,
    signTypedDataWithEth,
    getArtistAddress,
    getArtistAddressProof,
    suggestDefaultNetworks,
} from "../../../helpers.jsx";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { InputElement } from "../../atoms/input";
import { ButtonElement } from "../../atoms/button";
import { useState } from "react";
import { ethers } from "ethers";

const BuyToken = (props) => {
    const [buyTokenId, setBuyTokenId] = useState("");
    const butToken = async () => {
        if (props.activeAccountProps) {
            await suggestDefaultNetworks(props.activeProviderGlobalProps);
            const [contractAddress, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            const tokenIdPrice = parseInt((await contract.tokenIdToPriceOnSale(buyTokenId))._hex);
            const adminFee = parseInt(
                await contract.calculateAdminFee(props.activeAccountProps, String(tokenIdPrice))
            );
            const royalitiesFee = parseInt(
                await contract.calculateRoyaltiesFee(tokenIdPrice.toString())
            );
            const tokenTotalCost = ethers.utils.parseEther(
                String(tokenIdPrice + adminFee + royalitiesFee)
            );

            const creatorAddress = await getArtistAddress(buyTokenId);
            const addressProof = await getArtistAddressProof(buyTokenId, creatorAddress);

            if (
                await signTypedDataWithEth(
                    signer, //signer
                    props.activeAccountProps, //userAddress
                    contractAddress, //contractAddress
                    `Do you want to buy token with tokenID ${buyTokenId} for ${
                        tokenIdPrice / 10 ** 18
                    } ETH with ${(royalitiesFee + adminFee) / 10 ** 18} ETH fee?`, //textMessage
                    tokenIdPrice / 10 ** 18, //baseCost
                    adminFee / 10 ** 18, //adminFee
                    royalitiesFee / 10 ** 18 //royalitiesFee
                )
            ) {
                await contract
                    .buyTokenOnSale(buyTokenId, creatorAddress, addressProof, {
                        value: tokenTotalCost,
                    })
                    .then(() => {
                        console.log(
                            `>>> Token ${buyTokenId} has been bougth for ${tokenIdPrice} ETH!`
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
                    <h2>Buy NFT</h2>
                </CardContent>
                <CardActions>
                    <label>token ID:</label>
                    <InputElement
                        onChange={(e) => setBuyTokenId(e.target.value)}
                        value={buyTokenId}
                        id="buyTokenId"
                        type="text"
                    />
                    <br />
                    <ButtonElement onClick={butToken} type="submit">
                        Buy
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default BuyToken;
