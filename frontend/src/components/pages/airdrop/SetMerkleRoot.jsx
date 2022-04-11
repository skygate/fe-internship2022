import { getBaseERC721ContractComponents, signTypedDataSetMerkleRoot } from "../../../helpers.jsx";
import { ethers } from "ethers";
import { Card, Grid, CardContent, CardActions } from "@mui/material";
import { ButtonElement } from "../../atoms/button";
import { MerkleTree } from "merkletreejs";

const SetMerkleRoot = (props) => {
    const setMerkleRoot = async () => {
        if (props.activeAccountProps) {
            const [contractAddress, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            const maxAirDrop = parseInt((await contract.maxAirDrop())._hex);
            let adressesToMerkleTree = [...new Set(props.airdropAddressesProps)];
            if (adressesToMerkleTree > maxAirDrop) {
                adressesToMerkleTree = adressesToMerkleTree.slice(0, maxAirDrop);
            }

            if (
                await signTypedDataSetMerkleRoot(
                    signer, //signer
                    props.activeAccountProps, //userAddress
                    contractAddress, //contractAddress
                    "Do you want to end airdrop sign in and set merkel root?", //textMessage
                    adressesToMerkleTree //airdropAddresses
                )
            ) {
                const merkleTree = new MerkleTree(adressesToMerkleTree, ethers.utils.keccak256, {
                    hashLeaves: true,
                    sortPairs: true,
                });
                props.setMerkelTree(merkleTree);

                await contract
                    .setAirdropMerkleRoot(merkleTree.getHexRoot())
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
