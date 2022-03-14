import { getBaseERC721ContractComponents } from "../../../helpers.jsx";

const CancelSale = (props) => {
    const cancelSale = async () => {
        if (props.activeAccountProps) {
            const [, , , contract] = getBaseERC721ContractComponents();

            const tokenId = document.getElementById("cancelSaleId").value;
            await contract
                .cancelSale(tokenId)
                .then(() => {
                    console.log(`>>> Token ${tokenId} sale has been cancelled!`);
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
