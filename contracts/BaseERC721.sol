// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract BaseERC721 is ERC721, ERC721URIStorage, ERC721Holder, Ownable {
    using Counters for Counters.Counter;
    AggregatorV3Interface internal priceFeed;

    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => uint256) public tokenIdToPriceOnSale;
    mapping(uint256 => address) public tokenIdToOwnerAddressOnSale;

    constructor(
        string memory _name,
        string memory _symbol,
        address _priceFeedAddress
    ) ERC721(_name, _symbol) {
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    modifier isTokenOnSale(uint256 tokenId) {
        require(
            tokenIdToPriceOnSale[tokenId] > 0,
            "Cant perform this action, token is not on sale!"
        );
        _;
    }

    modifier isOwnerOfToken(uint256 tokenId) {
        require(
            ownerOf(tokenId) == msg.sender ||
                tokenIdToOwnerAddressOnSale[tokenId] == msg.sender,
            "Cant perform this action, you must be owner of this token!"
        );
        _;
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function payToMint(address recipients, string memory metadataURI)
        public
        payable
        returns (uint256)
    {
        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _mint(recipients, newItemId);
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function transfer(address from, address to, uint256 tokenId) public {
        _transfer(from, to, tokenId);
    }

    function _ownerOfToken(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function burn(uint256 tokenId) public isOwnerOfToken(tokenId)  {
        if(tokenIdToPriceOnSale[tokenId] > 0) {
            cancelSale(tokenId);
        }
        _burn(tokenId);
    }

    function startSale(uint256 tokenId, uint256 price)
        public
        isOwnerOfToken(tokenId)
    {
        require(price > 0, "Can not sale for 0 ETH!");
        tokenIdToPriceOnSale[tokenId] = price;
        tokenIdToOwnerAddressOnSale[tokenId] = msg.sender;
        safeTransferFrom(msg.sender, address(this), tokenId);
    }

    function cancelSale(uint256 tokenId)
        public
        isTokenOnSale(tokenId)
        isOwnerOfToken(tokenId)
    {
        _transfer(address(this), msg.sender, tokenId);
        delete tokenIdToPriceOnSale[tokenId];
        delete tokenIdToOwnerAddressOnSale[tokenId];
    }

    function buyTokenOnSale(uint256 tokenId)
        public
        payable
        isTokenOnSale(tokenId)
    {
        require(
            tokenIdToPriceOnSale[tokenId] <= msg.value,
            "Pleas provide minimum price of this specific token!"
        );
        _transfer(address(this), msg.sender, tokenId);
        (bool success, ) = tokenIdToOwnerAddressOnSale[tokenId].call{
            value: msg.value
        }("");
        require(success, "Transfer failed.");
        delete tokenIdToPriceOnSale[tokenId];
        delete tokenIdToOwnerAddressOnSale[tokenId];
    }

    function getLatestPrice() public view returns (int256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return answer;
    }
}
