import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { ethers } from "ethers";
import { Card, Grid, CardContent, CardActions } from "@mui/material";
import { ButtonElement } from "../../atoms/button";

const MintNFT = (props) => {
    const metadataURI = "ipfs://QmT8nzbH2Rr9WA55Rsv2uWFRBRCF4yGJWr44xSUrZGjTGc";

    const mint = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            if (await signMessageWithTxDetails(signer, "Do you want to mint new NFT?")) {
                await contract
                    .payToMint(props.activeAccountProps, metadataURI, {
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
