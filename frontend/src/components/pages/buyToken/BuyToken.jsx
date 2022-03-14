import { getBaseERC721ContractComponents } from "../../../helpers.jsx";

const BuyToken = (props) => {
    const butToken = async () => {
        if (props.activeAccountProps) {
            const [, , , contract] = getBaseERC721ContractComponents();

            const tokenId = document.getElementById("buyTokenId").value;
            const tokenIdPrice = parseInt((await contract.tokenIdToPriceOnSale(tokenId))._hex);
            await contract
                .buyTokenOnSale(tokenId, { value: tokenIdPrice.toString() })
                .then(() => {
                    console.log(
                        `>>> Token ${tokenId} has been bougth for ${tokenIdPrice / 10 ** 18} ETH!`
                    );
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
            <h2>Buy NFT</h2>
            <div>
                <label>token ID:</label>
                <input id="buyTokenId" type="text"></input>
                <br />
                <button onClick={butToken} type="submit">
                    Sell NFT
                </button>
            </div>
        </div>
    );
};

export default BuyToken;
