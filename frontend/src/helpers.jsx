import BaseERC721 from "./artifacts/contracts/BaseERC721.sol/BaseERC721.json";
import BaseBidNFT from "./artifacts/contracts/BaseBidNFT.sol/BaseBidNFT.json";
import { ethers } from "ethers";

export const getBaseERC721ContractComponents = (selectedProvider) => {
    const address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const provider = new ethers.providers.Web3Provider(selectedProvider);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, BaseERC721.abi, signer);

    return [address, provider, signer, contract];
};

export const getBaseBidNFTContractComponents = (selectedProvider) => {
    const address = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";
    const provider = new ethers.providers.Web3Provider(selectedProvider);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, BaseBidNFT.abi, signer);

    return [address, provider, signer, contract];
};

// If you want to omit signing everytime comment code inside and just return true
export const signMessageWithTxDetails = async (signer, message) => {
    let result;
    await signer
        .signMessage(message)
        .then(() => {
            result = true;
        })
        .catch(() => {
            result = false;
        });
    return result;
};
