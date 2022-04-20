import BaseERC721 from "./artifacts/contracts/BaseERC721.sol/BaseERC721.json";
import Sales from "./artifacts/contracts/Sales.sol/Sales.json";
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
    const contract = new ethers.Contract(address, Sales.abi, signer);

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

export const signTypedDataWithEth = async (
    signer,
    userAddress,
    contractAddress,
    textMessage,
    baseCost,
    adminFee,
    royalitiesFee
) => {
    const domain = {
        name: "SkyTemplate",
    };

    // The named list of all type definitions
    const types = {
        Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "contract", type: "address" },
        ],
        Person: [
            { name: "name", type: "string" },
            { name: "wallet", type: "address" },
        ],
        Costs: [
            { name: "baseCost", type: "string" },
            { name: "adminFee", type: "string" },
            { name: "royalitiesFee", type: "string" },
            { name: "totalCost_gasExlcuded", type: "string" },
        ],
        Mail: [
            { name: "contents", type: "string" },
            { name: "domain", type: "Domain" },
            { name: "from", type: "Person" },
            { name: "costs", type: "Costs" },
        ],
    };
    // The data to sign
    const value = {
        contents: textMessage,
        domain: {
            name: "SkyTemplate",
            version: "1",
            contract: contractAddress,
        },
        from: {
            name: "You",
            wallet: userAddress,
        },
        costs: {
            baseCost: `${baseCost} ETH`,
            adminFee: `${adminFee} ETH`,
            royalitiesFee: `${royalitiesFee} ETH`,
            totalCost_gasExlcuded: `${baseCost + adminFee + royalitiesFee} ETH`,
        },
    };
    const signature = await signer._signTypedData(domain, types, value);
    return signature;
};

export const signTypedDataWithoutEth = async (
    signer,
    userAddress,
    contractAddress,
    textMessage
) => {
    const domain = {
        name: "SkyTemplate",
    };

    // The named list of all type definitions
    const types = {
        Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "contract", type: "address" },
        ],
        Person: [
            { name: "name", type: "string" },
            { name: "wallet", type: "address" },
        ],
        Mail: [
            { name: "contents", type: "string" },
            { name: "domain", type: "Domain" },
            { name: "from", type: "Person" },
        ],
    };
    // The data to sign
    const value = {
        contents: textMessage,
        domain: {
            name: "SkyTemplate",
            version: "1",
            contract: contractAddress,
        },
        from: {
            name: "You",
            wallet: userAddress,
        },
    };
    const signature = await signer._signTypedData(domain, types, value);
    return signature;
};

export const signTypedDataSetMerkleRoot = async (
    signer,
    userAddress,
    contractAddress,
    textMessage,
    airdropAdresses
) => {
    const domain = {
        name: "SkyTemplate",
    };

    // The named list of all type definitions
    const types = {
        Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "contract", type: "address" },
        ],
        Person: [
            { name: "name", type: "string" },
            { name: "wallet", type: "address" },
        ],
        Mail: [
            { name: "contents", type: "string" },
            { name: "domain", type: "Domain" },
            { name: "from", type: "Person" },
            { name: "airdropAddresses", type: "address[]" },
        ],
    };
    // The data to sign
    const value = {
        contents: textMessage,
        domain: {
            name: "SkyTemplate",
            version: "1",
            contract: contractAddress,
        },
        from: {
            name: "You",
            wallet: userAddress,
        },
        airdropAddresses: airdropAdresses,
    };
    const signature = await signer._signTypedData(domain, types, value);
    return signature;
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

export const suggestDefaultNetworks = async (provider) => {
    if (provider.networkVersion != 31337) {
        await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x7a69" }],
        });
    }
};
