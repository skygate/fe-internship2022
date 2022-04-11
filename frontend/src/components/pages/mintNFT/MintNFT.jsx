import { getBaseERC721ContractComponents, signTypedDataWithEth } from "../../../helpers.jsx";
import { ethers } from "ethers";
import { Card, Grid, CardContent, CardActions } from "@mui/material";
import { ButtonElement } from "../../atoms/button";

const MintNFT = (props) => {
    const mint = async () => {
        if (props.activeAccountProps) {
            const [contractAddress, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            if (
                await signTypedDataWithEth(
                    signer, //signer
                    props.activeAccountProps, //userAddress
                    contractAddress, //contractAddress
                    "Do you want to mint new NFT?", //textMessage
                    0.005, //baseCost
                    0, //adminFee
                    0 //royalitiesFee
                )
            ) {
                await contract
                    .payToMint(props.activeAccountProps, {
                        value: ethers.utils.parseEther("0.005"),
                        maxPriorityFeePerGas: null,
                        maxFeePerGas: null,
                    })
                    .then(() => {
                        console.log(`>>> Token is minted!`);
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
                    <h2>Mint NFT</h2>
                </CardContent>
                <CardActions>
                    <ButtonElement onClick={mint}>MINT NFT</ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default MintNFT;
