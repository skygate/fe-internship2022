import { getBaseERC721ContractComponents, signMessageWithTxDetails } from "../../../helpers.jsx";

const CancelSale = (props) => {
    const cancelSale = async () => {
        if (props.activeAccountProps) {
            const [, , signer, contract] = getBaseERC721ContractComponents(
                props.activeProviderGlobalProps
            );
            const tokenId = document.getElementById("cancelSaleId").value;
            if (
                await signMessageWithTxDetails(
                    signer,
                    `Do you want to cancel sale of token with tokenID ${tokenId}?`
                )
            ) {
                await contract
                    .cancelSale(tokenId)
                    .then(() => {
                        console.log(`>>> Token ${tokenId} sale has been cancelled!`);
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
            <h2>Cancel Sale NFT</h2>
            <div>
                <label>token ID:</label>
                <input id="cancelSaleId" type="text"></input>
                <br />
                <button onClick={cancelSale} type="submit">
                    Cancel Sale of NFT
                </button>
            </div>
        </div>
    );
};

export default CancelSale;
