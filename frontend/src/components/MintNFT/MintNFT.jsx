import "./mintNFT.css";
import { ethers } from 'ethers';
import BaseERC721 from '../../artifacts/contracts/BaseERC721.sol/BaseERC721.json';

const MintNFT = (props) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contractAddress = "0x68D33A65A2341Fa2269b0150C3DA4912D8a7abFe";
    const metadataURI = "ipfs://QmT8nzbH2Rr9WA55Rsv2uWFRBRCF4yGJWr44xSUrZGjTGc";

    const contract = new ethers.Contract(contractAddress, BaseERC721.abi, signer);

    const count = async () => {
        const count = await contract.count();
        console.log(parseInt(count));
    }

    const mint = async () => {
        const newlyMintedToken = await contract.payToMint(
            props.activeAccountProps,
            metadataURI,
            {
                value: ethers.utils.parseEther("0.00"),
                from: props.activeAccountProps,
                maxPriorityFeePerGas: null,
                maxFeePerGas: null,
            }
        );

        await newlyMintedToken.wait();
    }

    return (
        <div className="nft">
            <div className="header-right">
                <h1>{props.activeAccountProps}</h1>
            </div>

            <button onClick={mint}>MINT NFT</button>
            <button onClick={count}>COUNT</button>
        </div>
    );
};

export default MintNFT;
