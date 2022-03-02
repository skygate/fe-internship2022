import "./mintNFT.css";
import { getContractComponents } from "../../helpers.jsx";
import { ethers } from "ethers";

const MintNFT = (props) => {
  const metadataURI = "ipfs://QmT8nzbH2Rr9WA55Rsv2uWFRBRCF4yGJWr44xSUrZGjTGc";

  const mint = async () => {
    if (props.activeAccountProps) {
      const [contract] = getContractComponents();

      await contract
        .payToMint(props.activeAccountProps, metadataURI, {
          value: ethers.utils.parseEther("0.00"),
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
    <div className="nft">
      <button onClick={mint} type="submit">
        MINT NFT
      </button>
    </div>
  );
};

export default MintNFT;
