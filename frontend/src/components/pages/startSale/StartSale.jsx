import { getBaseERC721ContractComponents, signTypedDataWithoutEth } from "../../../helpers.jsx";
import { ethers } from "ethers";
import { Grid, Card, CardContent, CardActions } from "@mui/material";
import { ButtonElement } from "../../atoms/button";
import { InputElement } from "../../atoms/input";
import { useState } from "react";

const StartSale = (props) => {
    const [startSaleTokenId, setStartSaleTokenId] = useState("");
    const [startSalePrice, setStartSalePrice] = useState("");
    const startSale = async () => {
        if (props.activeAccountProps) {
            const [contractAddress, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            if (
                await signTypedDataWithoutEth(
                    signer, //signer
                    props.activeAccountProps, //userAddress
                    contractAddress, //contractAddress
                    `Do you want to start sale of token with tokenId ${startSaleTokenId} for price ${startSalePrice} ETH?` //textMessage
                )
            ) {
                await contract
                    .startSale(startSaleTokenId, ethers.utils.parseEther(startSalePrice))
                    .then(() => {
                        console.log(
                            `>>> Token ${startSaleTokenId} has been put on sale for ${startSalePrice} ETH!`
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
                    <h2>Sell NFT</h2>
                </CardContent>
                <CardActions>
                    <label>token ID:</label>
                    <InputElement
                        onChange={(e) => setStartSaleTokenId(e.target.value)}
                        value={startSaleTokenId}
                        id="startSaleTokenId"
                        type="text"
                    />
                    <br />
                    <label>ETH price: </label>
                    <InputElement
                        onChange={(e) => setStartSalePrice(e.target.value)}
                        value={startSalePrice}
                        id="startSalePrice"
                        type="text"
                    />
                    <br />
                    <ButtonElement onClick={startSale} type="submit">
                        Sell NFT
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default StartSale;
