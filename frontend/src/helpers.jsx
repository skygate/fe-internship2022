import BaseERC721 from "./artifacts/contracts/BaseERC721.sol/BaseERC721.json"
import { ethers } from 'ethers';

export const getContractComponents = () => {
    const address = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, BaseERC721.abi, signer);

    return [address, provider, signer, contract]
}