import { getBaseERC721ContractComponents } from "../../../helpers.jsx";
import { useState } from "react";

const TokenPriceOnSale = (props) => {
    const [tokenOnSaleTokenId, setTokenOnSaleTokenId] = useState("");
    const getTokenPrice = async () => {
        if (props.activeAccountProps) {
            const [, , , contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );

            await contract
                .tokenIdToPriceOnSale(tokenOnSaleTokenId)
                .then((result) => {
                    if (parseInt(result._hex) === 0) {
                        console.log(`>>> Token ${tokenOnSaleTokenId} is not for sale!`);
                    } else {
                        console.log(
                            `>>> Token ${tokenOnSaleTokenId} costs: ${parseInt(result._hex)}`
                        );
                    }
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
                <h2>Get token price on sale</h2>
                <input
                    onChange={(e) => setTokenOnSaleTokenId(e.target.value)}
                    value={tokenOnSaleTokenId}
                    id="tokenOnSaleTokenId"
                    type="text"
                ></input>
                <br />
                <button onClick={getTokenPrice} type="submit">
                    Get token price
                </button>
            </div>
        </div>
    );
};

export default TokenPriceOnSale;
