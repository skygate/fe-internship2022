import { getBaseERC721ContractComponents, signTypedDataWithoutEth } from "../../../helpers.jsx";
import { Card, Grid, CardContent, CardActions } from "@mui/material";
import { ButtonElement } from "../../atoms/button";

const JoinAirdrop = (props) => {
    const joinAirdrop = async () => {
        if (props.activeAccountProps) {
            const [contracAddress, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );
            const maxAirDrop = parseInt((await contract.maxAirDrop())._hex);
            if (
                await signTypedDataWithoutEth(
                    signer, //signer
                    props.activeAccountProps, //userAddress
                    contracAddress, //contractAddress
                    "Do you want to join NFT Airdrop?"
                ) //textMessage
            ) {
                if (
                    !props.airdropAddressesProps.includes(props.activeAccountProps) &&
                    maxAirDrop > props.airdropAddressesProps.length
                ) {
                    props.setAirdropAddresses((oldArray) => [
                        ...oldArray,
                        props.activeAccountProps,
                    ]);
                    // Removes duplicates from array.
                    // If user clicks X times JOIN button then addres is added multiple times to array,
                    // creating sets deletes duplicates to be sure.
                    props.setAirdropAddresses((oldArray) => [...new Set(oldArray)]);
                    console.log(
                        `>>> You signed into airdrop with address: ${props.activeAccountProps}`
                    );
                } else {
                    console.log(">>> You are already in airdrop or limit has been reached!");
                }
            }
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    return (
        <Grid item xs={6}>
            <Card>
                <CardContent>
                    <h2>Join Airdrop</h2>
                </CardContent>
                <CardActions>
                    <ButtonElement onClick={joinAirdrop}>Join</ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default JoinAirdrop;
