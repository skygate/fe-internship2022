// import { Grid } from "@mui/material";
// import React, { useState } from "react";
// import { useEffect } from "react";
// import { useMoralis } from "react-moralis";
// import fetch from "node-fetch";

// const ImportNFT = (props) => {
//     const { Moralis } = useMoralis();
//     const [imageNFTs, setImageNFTs] = useState([]);

//     const networks = {
//         1: "mainnet",
//         42: "kovan",
//         3: "ropsten",
//         4: "rinkeby",
//         5: "goerli",
//     };

//     const getNFTBalances = async () => {
//         if (props.activeAccountProps !== null) {
//             setImageNFTs([]);
//             const nft = await importNFT();

//             nft.map((data) => {
//                 let img = data.image;
//                 if (img.search("ipfs") != -1) {
//                     img = img.replace("ipfs://", "https://ipfs.io/");
//                 }

//                 setImageNFTs((imageNFTs) => [...imageNFTs, img]);
//             });
//         }
//     };

//     const importNFT = async () => {
//         const nftObject = {
//             chain: networks[parseInt(props.activeProviderGlobalProps.chainId, 16)],
//             address: props.activeAccountProps,
//         };

//         const nftHandler = await Moralis.Web3.getNFTs(nftObject);
//         const data = await nftHandler;
//         let nftArray = [];
//         for (let i = 0; i < data.length; i++) {
//             const metadataInfo = await fetch(data[i].token_uri);
//             const metadata = await metadataInfo.json();
//             const nftToImport = {
//                 object_id: data[i].object_id,
//                 token_id: data[i].token_id,
//                 token_uri: data[i].token_uri,
//                 contract_type: data[i].ontract_type,
//                 token_address: data[i].token_address,
//                 image: metadata["image"],
//                 name: metadata["name"],
//                 description: metadata["description"],
//             };
//             nftArray.push(nftToImport);
//         }

//         console.log(nftArray);
//         return nftArray;
//     };

//     useEffect(async () => {
//         await getNFTBalances();
//         const w = await importNFT();
//     }, []);

//     return (
//         <Grid item xs={6}>
//             <div>
//                 <button onClick={getNFTBalances} type="submit">
//                     Get NFT from accounts
//                 </button>

//                 <ul>
//                     {imageNFTs.map((item) => {
//                         return (
//                             <li>
//                                 <img
//                                     src={item}
//                                     alt="nft_image_is_empty"
//                                     width="250"
//                                     height="250"
//                                     border="2px solid"
//                                 />
//                             </li>
//                         );
//                     })}
//                 </ul>
//             </div>
//         </Grid>
//     );
// };

// export default ImportNFT;

export {}
