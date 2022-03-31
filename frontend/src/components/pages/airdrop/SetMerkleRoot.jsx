import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { ethers } from "ethers";
import { Card, Grid, CardContent, CardActions } from "@mui/material";
import { ButtonElement } from "../../atoms/button";
import { MerkleTree } from "merkletreejs";

const SetMerkleRoot = (props) => {
    const setMerkleRoot = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            if (
                await signMessageWithTxDetails(
                    signer,
                    "Do you want to end airdrop sign in and set merkel root?"
                )
            ) {
                const maxAirDrop = parseInt((await contract.maxAirDrop())._hex);
                let adressesToMerkleTree = [...new Set(props.airdropAddressesProps)];
                if (adressesToMerkleTree > maxAirDrop) {
                    adressesToMerkleTree = adressesToMerkleTree.slice(0, maxAirDrop);
                }
                const merkleTree = new MerkleTree(adressesToMerkleTree, ethers.utils.keccak256, {
                    hashLeaves: true,
                    sortPairs: true,
                });
                props.setMerkelTree(merkleTree);

                await contract
                    .setMerkleRoot(merkleTree.getHexRoot())
                    .then(() => {
                        console.log(`>>> MerkleRoot has been set: ${merkleTree.getHexRoot()}`);
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
                    <h2>Set Merkle Root</h2>
                </CardContent>
                <CardActions>
                    <ButtonElement onClick={setMerkleRoot}>Set</ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default SetMerkleRoot;
