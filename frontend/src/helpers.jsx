import BaseERC721 from "./artifacts/contracts/BaseERC721.sol/BaseERC721.json";
import BaseBidNFT from "./artifacts/contracts/BaseBidNFT.sol/BaseBidNFT.json";
import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";

// https://github.com/BlockTheChainz/airdrop-merkle/blob/main/index.html
const hexStringToUint8Array = (hexString) => {
    if (hexString.length % 2 !== 0) {
        throw "Invalid hexString";
    }
    let arrayBuffer = new Uint8Array(hexString.length / 2);

    for (let i = 0; i < hexString.length; i += 2) {
        let byteValue = parseInt(hexString.substr(i, 2), 16);
        if (isNaN(byteValue)) {
            throw "Invalid hexString";
        }
        arrayBuffer[i / 2] = byteValue;
    }
    return arrayBuffer;
};

const hashToken = (tokenId, account) => {
    const leaf = ethers.utils
        .solidityKeccak256(["uint256", "address"], [tokenId, account])
        .slice(2);
    return hexStringToUint8Array(leaf);
};

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

export const getArtistAddress = async (tokenID) => {
    const data = require("./artistData.json");
    return data[tokenID];
};

export const getArtistAddressProof = async (tokenId, creatorAddress) => {
    const data = require("./artistData.json");
    const artistMerkleTree = new MerkleTree(
        Object.entries(data).map((token) => hashToken(...token)),
        ethers.utils.keccak256,
        { sortPairs: true }
    );
    return artistMerkleTree.getHexProof(hashToken(tokenId, creatorAddress));
};
