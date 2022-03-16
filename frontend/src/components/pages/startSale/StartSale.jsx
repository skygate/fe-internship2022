import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";
import { ethers } from "ethers";

const StartSale = (props) => {
    const startSale = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );
            const tokenId = document.getElementById("sellTokenId").value;
            const price = ethers.utils.parseEther(document.getElementById("sellTokenPrice").value);
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to start sale of token with tokenId ${tokenId} for price ${
                        price / 10 ** 18
                    } ETH?`
                )
            ) {
                await contract
                    .startSale(tokenId, price)
                    .then(() => {
                        console.log(
                            `>>> Token ${tokenId} has been put on sale for ${price / 10 ** 18} ETH!`
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
        <div className="center">
            <h2>Sell NFT</h2>
            <div>
                <label>token ID:</label>
                <input id="sellTokenId" type="text"></input>
                <br />
                <label>ETH price: </label>
                <input id="sellTokenPrice" type="text"></input>
                <br />
                <button onClick={startSale} type="submit">
                    Sell NFT
                </button>
            </div>
        </div>
    );
};

export default StartSale;
