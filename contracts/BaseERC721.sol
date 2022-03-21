// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract BaseERC721 is ERC721, ERC721Holder, Ownable {
    using Counters for Counters.Counter;
    AggregatorV3Interface internal priceFeed;
    uint256 public transactionFee = 1000; // 1000 = 1%
    uint256 public mintPrice = 500000000000000; // 0.0005 ETH
    uint256 public mintLimit = 10;

    Counters.Counter private tokenIdCounter;
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
            ownerOf(tokenId) == msg.sender || tokenIdToOwnerAddressOnSale[tokenId] == msg.sender,
            "Cant perform this action, you must be owner of this token!"
        );
        _;
    }

    modifier isMintPossible() {
        require(
            tokenIdCounter.current() < mintLimit,
            "Cant perform this action, limit of mint has been reached."
        );
        _;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmVrAoaZAeX5c7mECGbFS5wSbwFW748F2F6wsjZyLtfhgM/";
    }

    function safeMint(address to) public onlyOwner isMintPossible {
        uint256 tokenId = tokenIdCounter.current();
        tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function payToMint(address recipients) public payable isMintPossible returns (uint256) {
        require(
            msg.value >= mintPrice,
            "Cant perform this action, you send not enough ETH to mint."
        );
        uint256 newItemId = tokenIdCounter.current();
        tokenIdCounter.increment();
        _mint(recipients, newItemId);
        return newItemId;
    }

    function count() public view returns (uint256) {
        return tokenIdCounter.current();
    }

    function transfer(
        address from,
        address to,
        uint256 tokenId
    ) public {
        _transfer(from, to, tokenId);
    }

    function burn(uint256 tokenId) public isOwnerOfToken(tokenId) {
        if (tokenIdToPriceOnSale[tokenId] > 0) {
            cancelSale(tokenId);
        }
        _burn(tokenId);
    }

    function startSale(uint256 tokenId, uint256 price) public isOwnerOfToken(tokenId) {
        require(price > 0, "Can not sale for 0 ETH!");
        tokenIdToPriceOnSale[tokenId] = price;
        tokenIdToOwnerAddressOnSale[tokenId] = msg.sender;
        safeTransferFrom(msg.sender, address(this), tokenId);
    }

    function cancelSale(uint256 tokenId) public isTokenOnSale(tokenId) isOwnerOfToken(tokenId) {
        _transfer(address(this), msg.sender, tokenId);
        delete tokenIdToPriceOnSale[tokenId];
        delete tokenIdToOwnerAddressOnSale[tokenId];
    }

    function buyTokenOnSale(uint256 tokenId) public payable isTokenOnSale(tokenId) {
        require(
            tokenIdToPriceOnSale[tokenId] <= msg.value,
            "Pleas provide minimum price of this specific token!"
        );
        _transfer(address(this), msg.sender, tokenId);
        (bool success, ) = payable(tokenIdToOwnerAddressOnSale[tokenId]).call{
            value: calculateAmoutWithoutFee(msg.value, transactionFee)
        }("");
        require(success, "Transfer failed.");
        delete tokenIdToPriceOnSale[tokenId];
        delete tokenIdToOwnerAddressOnSale[tokenId];
    }

    function getLatestPrice() public view returns (int256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return answer;
    }

    function calculateAmoutWithoutFee(uint256 amount, uint256 feeInPercentage)
        public
        pure
        returns (uint256)
    {
        return ((amount * (100000 - feeInPercentage)) / 100000);
    }

    function setTransactionFee(uint256 _newFee) public onlyOwner {
        transactionFee = _newFee;
    }

    function withdrawOwnerFee() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    function changeMintPrice(uint256 newMintPrice) public onlyOwner {
        mintPrice = newMintPrice;
    }
}
