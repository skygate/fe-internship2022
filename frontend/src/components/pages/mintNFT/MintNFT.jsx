import { getBaseERC721ContractComponents } from "../../../helpers.jsx";
import { ethers } from "ethers";

const MintNFT = (props) => {
    const metadataURI = "ipfs://QmT8nzbH2Rr9WA55Rsv2uWFRBRCF4yGJWr44xSUrZGjTGc";

    const mint = async () => {
        if (props.activeAccountProps) {
            const [, , , contract] = getBaseERC721ContractComponents();

            await contract
                .payToMint(props.activeAccountProps, metadataURI, {
                    value: ethers.utils.parseEther("0.005"),
                    maxPriorityFeePerGas: null,
                    maxFeePerGas: null,
                })
                .then(() => {
                    console.log(`>>> Token is minted!`);
                })
                .catch((error) => {
                    console.log(error.data.message);
                });
        } else {
            console.log(">>> Please login to perform this action!");
        }
    };

    return (
        <div>
            <h2>Mint NFT</h2>
            <button onClick={mint} type="submit">
                MINT NFT
            </button>
        </div>
    );
};

export default MintNFT;
