import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { ethers } from "ethers";
import { Card, Grid, CardContent, CardActions } from "@mui/material";
import { ButtonElement } from "../../atoms/button";

const ClaimAirdrop = (props) => {
    const claimAirdrop = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );
            if (props.merkelTreeProps.length != 0) {
                if (
                    await signMessageWithTxDetails(signer, "Do you want to claim NFT via airdrop?")
                ) {
                    const proof = props.merkelTreeProps.getHexProof(
                        ethers.utils.keccak256(props.activeAccountProps)
                    );

                    await contract
                        .claimTokenFromAirdrop(proof)
                        .then(() => {
                            console.log(`>>> Token has been claimed!`);
                        })
                        .catch((error) => {
                            console.log(error.data.message);
                        });
                }
            } else {
                console.log(">>> Airdrop not started yet!");
            }
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    return (
        <Grid item xs={6}>
            <Card>
                <CardContent>
                    <h2>Claim token</h2>
                </CardContent>
                <CardActions>
                    <ButtonElement onClick={claimAirdrop}>claim</ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default ClaimAirdrop;
