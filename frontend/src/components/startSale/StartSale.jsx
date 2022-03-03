import { getBaseERC721ContractComponents } from '../../helpers.jsx';
import { ethers } from 'ethers';

const StartSale = (props) => {
    const startSale = async () => {
        if (props.activeAccountProps) {
            const [,,, contract] = getBaseERC721ContractComponents();

            const tokenId = document.getElementById('sellTokenId').value;
            const price = ethers.utils.parseEther(document.getElementById('sellTokenPrice').value);
            await contract.startSale(tokenId, price)
                .then(() => { console.log(`>>> Token ${tokenId} has been put on sale for ${price / 10 ** 18} ETH!`); })
                .catch((error) => {
                    console.log(error.data.message);
                })
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    return (
        <div className="center">
            <div>
                <label>token ID:</label>
                <input id="sellTokenId" type="text"></input><br />
                <label>ETH price: </label>
                <input id="sellTokenPrice" type="text"></input><br />
                <button onClick={startSale} type="submit">Sell NFT</button>
            </div>
        </div>
    );
};

export default StartSale;