import '../mainContext/mainContext.css';
import { getContractComponents } from '../../helpers.jsx';


const StartSale = (props) => {
    const startSale = async () => {
        if(props.activeAccountProps) {
            const [address, provider, signer, contract] = getContractComponents();

            const tokenId = document.getElementById('sellTokenId').value
            const price = document.getElementById('sellTokenPrice').value
            await contract.startSale(tokenId, price)
                .then(() => { console.log(">>> Transaction has been put on sale!"); })
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