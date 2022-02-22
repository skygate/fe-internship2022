import '../mainContext/mainContext.css';
import { getContractComponents } from '../../helpers.jsx';

const BurnToken = (props) => {
    const burnToken = async () => {
        if (props.activeAccountProps) {
            const [address, provider, signer, contract] = getContractComponents();

            const tokenId = document.getElementById('burnTokenId').value;
            await contract.burn(tokenId)
                .then(() => { console.log(`>>> Token ${tokenId} has been burned!`); })
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
                <input id="burnTokenId" type="text"></input><br />
                <button onClick={burnToken} type="submit">Burn NFT</button>
            </div>
        </div>
    );
};

export default BurnToken;