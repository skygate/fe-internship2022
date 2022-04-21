// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract BaseERC721Upgradeable is
    Initializable,
    ERC721Upgradeable,
    ERC721HolderUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    uint256 public transactionFee; // 1000 = 1%

    CountersUpgradeable.Counter private _tokenIdCounter;
    mapping(uint256 => uint256) public tokenIdToPriceOnSale;
    mapping(uint256 => address) public tokenIdToOwnerAddressOnSale;

    function initialize(
        string memory _name,
        string memory _symbol       
    ) public initializer {
        __Ownable_init();
        __ERC721_init(_name, _symbol);
        __UUPSUpgradeable_init();
        transactionFee = 1000;
    }

    modifier isTokenOnSale(uint256 tokenId) virtual {
        require(
            tokenIdToPriceOnSale[tokenId] > 0,
            "Cant perform this action, token is not on sale!"
        );
        _;
    }

    modifier isOwnerOfToken(uint256 tokenId) virtual {
        require(
            ownerOf(tokenId) == msg.sender || tokenIdToOwnerAddressOnSale[tokenId] == msg.sender,
            "Cant perform this action, you must be owner of this token!"
        );
        _;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmVrAoaZAeX5c7mECGbFS5wSbwFW748F2F6wsjZyLtfhgM/";
    }

    function safeMint(address to) public virtual onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function payToMint(address recipients) public payable virtual returns (uint256) {
        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _mint(recipients, newItemId);

        return newItemId;
    }

    function count() public view virtual returns (uint256) {
        return _tokenIdCounter.current();
    }

    function burn(uint256 tokenId) public virtual isOwnerOfToken(tokenId) {
        if (tokenIdToPriceOnSale[tokenId] > 0) {
            cancelSale(tokenId);
        }
        _burn(tokenId);
    }

    function startSale(uint256 tokenId, uint256 price) public virtual isOwnerOfToken(tokenId) {
        require(price > 0, "Can not sale for 0 ETH!");
        tokenIdToPriceOnSale[tokenId] = price;
        tokenIdToOwnerAddressOnSale[tokenId] = msg.sender;
        safeTransferFrom(msg.sender, address(this), tokenId);
    }

    function cancelSale(uint256 tokenId)
        public
        virtual
        isTokenOnSale(tokenId)
        isOwnerOfToken(tokenId)
    {
        _transfer(address(this), msg.sender, tokenId);
        delete tokenIdToPriceOnSale[tokenId];
        delete tokenIdToOwnerAddressOnSale[tokenId];
    }

    function buyTokenOnSale(uint256 tokenId) public payable virtual isTokenOnSale(tokenId) {
        require(
            tokenIdToPriceOnSale[tokenId] <= msg.value,
            "Pleas provide minimum price of this specific token!"
        );
        _transfer(address(this), msg.sender, tokenId);
        splitPayment(tokenIdToOwnerAddressOnSale[tokenId], msg.value);
        delete tokenIdToPriceOnSale[tokenId];
        delete tokenIdToOwnerAddressOnSale[tokenId];
    }

    function getLatestPrice(address dataFeedProxy) public view returns (int256) {
        (, int256 answer, , , ) = AggregatorV3Interface(dataFeedProxy).latestRoundData();
        return answer;
    }

    function splitPayment(address to, uint256 amount) public virtual {
        (bool success, ) = payable(to).call{value: (amount * (100000 - transactionFee)) / 100000}(
            ""
        );
        require(success, "Transfer failed.");
    }

    function setTransactionFee(uint256 _newFee) public virtual onlyOwner {
        transactionFee = _newFee;
    }

    function withdraw() public virtual onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }
}

contract BaseERC721UpgradeableV2 is BaseERC721Upgradeable {
    modifier isOwnerOfToken(uint256 tokenId) virtual override {
        require(
            ownerOf(tokenId) == msg.sender || tokenIdToOwnerAddressOnSale[tokenId] == msg.sender,
            "BaseERC721 Error: Can't perform this action, you must be owner of this token!"
        );
        _;
    }
}
