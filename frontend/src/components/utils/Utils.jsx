import '../mainContext/mainContext.css';
import { getBaseERC721ContractComponents } from '../../helpers.jsx';
import { ethers } from 'ethers';


const BuyToken = (props) => {
    const getTokenCount = async () => {
        if(props.activeAccountProps) {
            const [,,, contract] = getBaseERC721ContractComponents();

            await contract.count()
                .then((result) => { console.log(`>>> Token count: ${parseInt(result._hex)}`); })
                .catch((error) => {
                    console.log(error.data.message);
                })
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    const getTokenPrice = async () => {
        if(props.activeAccountProps) {
            const [,,, contract] = getBaseERC721ContractComponents();
            
            const tokenId = document.getElementById('getTokenIdPrice').value;
            await contract.tokenIdToPriceOnSale(tokenId)
                .then((result) => {
                    if(parseInt(result._hex) === 0 ) {
                        console.log(`>>> Token ${tokenId} is not for sale!`)
                    } else {
                    console.log(`>>> Token ${tokenId} costs: ${parseInt(result._hex)}`);
                    } 
                })
                .catch((error) => {
                    console.log(error.data.message);
                })
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    const getTokenOwner = async () => {
        if(props.activeAccountProps) {
            const [,,, contract] = getBaseERC721ContractComponents();
            
            const tokenId = document.getElementById('getTokenIdOwner').value;
            await contract.ownerOf(tokenId)
                .then((result) => {
                    console.log(`>>> Owner of token ${tokenId} is: ${result}`);
                })
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
                <h3>Get token count</h3>
                <button onClick={getTokenCount} type="submit">Get token count</button>
            </div>
            <div>
                <h3>Get token price on sale</h3>
                <input id="getTokenIdPrice" type="text"></input><br />
                <button onClick={getTokenPrice} type="submit">Get token price</button>
            </div>
            <div>
                <h3>Get token owner</h3>
                <input id="getTokenIdOwner" type="text"></input><br />
                <button onClick={getTokenOwner} type="submit">Get token owner</button>
            </div>
        </div>
    );
};

export default BuyToken;