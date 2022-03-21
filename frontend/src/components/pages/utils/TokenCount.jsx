import { getBaseERC721ContractComponents } from "../../../helpers.jsx";
import { Card, Grid, CardActions, CardContent } from "@mui/material";
import { ButtonElement } from "../../atoms/button";

const TokenCount = (props) => {
    const getTokenCount = async () => {
        if (props.activeAccountProps) {
            const [, , , contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            await contract
                .count()
                .then((result) => {
                    console.log(`>>> Token count: ${parseInt(result._hex)}`);
                })
                .catch((error) => {
                    // console.log(error.message);
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
                    <h2>Get token count</h2>
                </CardContent>
                <CardActions>
                    <ButtonElement onClick={getTokenCount} type="submit">
                        Get token count
                    </ButtonElement>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default TokenCount;
