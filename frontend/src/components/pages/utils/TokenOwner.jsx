import { getBaseERC721ContractComponents } from "../../../helpers.jsx";
import { useState } from "react";

const TokenOwner = (props) => {
    const [ownerTokenId, setOwnerTokenId] = useState("");

    const getTokenOwner = async () => {
        if (props.activeAccountProps) {
            const [, , , contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            await contract
                .ownerOf(ownerTokenId)
                .then((result) => {
                    console.log(`>>> Owner of token ${ownerTokenId} is: ${result}`);
                })
                .catch((error) => {
                    console.log(error.data.message);
                });
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    return (
        <div className="center">
            <div>
                <h2>Get token owner</h2>
                <input
                    onChange={(e) => setOwnerTokenId(e.target.value)}
                    value={ownerTokenId}
                    id="ownerTokenId"
                    type="text"
                ></input>
                <br />
                <button onClick={getTokenOwner} type="submit">
                    Get token owner
                </button>
            </div>
        </div>
    );
};

export default TokenOwner;
