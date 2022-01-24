// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NftInternship is ERC721, Ownable {
    constructor() ERC721("SkyGateNFTInternship", "SkyNFTI") {}
}
