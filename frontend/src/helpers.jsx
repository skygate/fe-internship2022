import BaseERC721 from "./artifacts/contracts/BaseERC721.sol/BaseERC721.json"
import { ethers } from 'ethers';

export const getContractComponents = () => {
    const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, BaseERC721.abi, signer);

    return [address, provider, signer, contract]
}