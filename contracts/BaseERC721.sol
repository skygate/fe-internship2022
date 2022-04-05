// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract BaseERC721 is ERC721, ERC721Holder, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIdCounter;
    AggregatorV3Interface internal priceFeed;
    address baseBidNFTAddress;

    uint256 public adminFeeToWithdraw;
    uint256 public adminFeePercentage = 1000; // 1000 = 1%
    uint256 public royaltiesFeePercentage = 1000; // 1000 = 1%
    uint256 public mintPrice = 500000000000000; // 0.0005 ETH
    uint256 public mintLimit = 10;
    uint256 public basicTicketPrice = 10**17;
    // uint256 public maxAcumulativeValueOfTransactions = 10 * 10**18;
    uint256 public maxAirDrop = 3;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ASSOCIATED_CONTRACT = keccak256("ASSOCIATED_CONTRACT");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public airdropMerkleRoot;
    bytes32 public artistMerkleRoot;

    mapping(uint256 => uint256) public tokenIdToPriceOnSale;
    mapping(uint256 => address) public tokenIdToOwnerAddressOnSale;
    mapping(address => BasicTicket) public addressToBasicTicket;
    mapping(address => bool) public addressToPremiumTicket;
    mapping(address => bool) public claimed;

    struct BasicTicket {
        uint256 acumulativeValueOfTransactions;
        uint256 ticketExpirationDate;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _priceFeedAddress,
        bytes32 _artistMerkleRoot
    ) ERC721(_name, _symbol) {
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
        artistMerkleRoot = _artistMerkleRoot;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(ADMIN_ROLE, msg.sender);
        grantRole(MINTER_ROLE, msg.sender);
        grantRole(MINTER_ROLE, address(this));
        grantRole(ASSOCIATED_CONTRACT, address(this));
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
        return "ipfs://QmZxyuVa643bQSSgshdeZbixuiM3Fh8V9CRKCvuSnM9CsV/";
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function safeMint(address to) public onlyRole(MINTER_ROLE) isMintPossible {
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
        adminFeeToWithdraw += msg.value;
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

    function buyTokenOnSale(
        uint256 tokenId,
        address creatorArtist,
        bytes32[] memory proof
    ) external payable isTokenOnSale(tokenId) {
        uint256 adminFee = calculateAdminFee(msg.sender, tokenIdToPriceOnSale[tokenId]);
        uint256 royaltiesFee = calculateRoyaltiesFee(tokenIdToPriceOnSale[tokenId]);
        require(isArtist(tokenId, creatorArtist, proof), "Invalid artist address!");
        require(
            tokenIdToPriceOnSale[tokenId] + adminFee + royaltiesFee <= msg.value,
            "Pleas provide minimum price of this specific token!"
        );
        _transfer(address(this), msg.sender, tokenId);
        (bool success, ) = payable(tokenIdToOwnerAddressOnSale[tokenId]).call{
            value: tokenIdToPriceOnSale[tokenId]
        }("");
        require(success, "Failed to send Ether");
        this.increaseAcumulativeValueOfTransactions(msg.sender, tokenIdToPriceOnSale[tokenId]);
        adminFeeToWithdraw += adminFee;
        (success, ) = payable(creatorArtist).call{value: royaltiesFee}("");
        require(success, "Failed to send Ether");
        delete tokenIdToPriceOnSale[tokenId];
        delete tokenIdToOwnerAddressOnSale[tokenId];
    }

    function getLatestPrice() public view returns (int256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return answer;
    }

    function calculateAdminFee(address user, uint256 amount) public view returns (uint256) {
        return checkIfUserHasDiscount(user) ? 0 : ((amount / 100000) * adminFeePercentage);
    }

    /**
        @dev Users with tickest doesn't need to pay royalties fee when token is sold.
     */
    // function calculateRoyaltiesFee(address user, uint256 amount) public view returns (uint256) {
    //     return checkIfUserHasDiscount(user) ? 0 : ((amount / 100000) * royaltiesFeePercentage);
    // }

    /**
        @dev Users with tickest still need to pay royalities fee when token is sold.
     */
    function calculateRoyaltiesFee(uint256 amount) public view returns (uint256) {
        return ((amount / 100000) * royaltiesFeePercentage);
    }

    function setAdminFee(uint256 _newFee) public onlyRole(ADMIN_ROLE) {
        adminFeePercentage = _newFee;
    }

    function setRoyaltiesFee(uint256 _newFee) public onlyRole(ADMIN_ROLE) {
        royaltiesFeePercentage = _newFee;
    }

    function withdrawAdminFee() public onlyRole(ADMIN_ROLE) {
        (bool success, ) = payable(msg.sender).call{value: adminFeeToWithdraw}("");
        require(success, "Transfer failed.");
    }

    function changeMintPrice(uint256 newMintPrice) public onlyRole(ADMIN_ROLE) {
        mintPrice = newMintPrice;
    }

    function setBaseBidNFTAddress(address _baseBidNFTAddress) public onlyRole(ADMIN_ROLE) {
        revokeRole(ASSOCIATED_CONTRACT, baseBidNFTAddress);
        baseBidNFTAddress = _baseBidNFTAddress;
        grantRole(ASSOCIATED_CONTRACT, _baseBidNFTAddress);
    }

    function setAirdropMerkleRoot(bytes32 _airdropMerkleRoot) public onlyRole(ADMIN_ROLE) {
        airdropMerkleRoot = _airdropMerkleRoot;
    }

    function buyBasicTicket() public payable {
        require(
            msg.value >= basicTicketPrice,
            "Cant perform this action, amount send to buy basic ticket to low!"
        );
        addressToBasicTicket[msg.sender] = BasicTicket(0, block.timestamp + 1095 days);
    }

    function buyPremiumTicket() public payable {
        require(
            msg.value >= basicTicketPrice * 10,
            "Cant perform this action, amount send to buy premium ticket to low!"
        );
        addressToPremiumTicket[msg.sender] = true;
    }

    function checkIfUserHasDiscount(address user) public view returns (bool) {
        if (
            addressToBasicTicket[user].ticketExpirationDate > block.timestamp &&
            addressToBasicTicket[user].acumulativeValueOfTransactions < 10 * 10**18
        ) {
            return true;
        } else if (addressToPremiumTicket[user]) {
            // unimplemented tokens for marketplace
            return true;
        } else {
            return false;
        }
    }

    function increaseAcumulativeValueOfTransactions(address user, uint256 amount)
        public
        onlyRole(ASSOCIATED_CONTRACT)
    {
        if (addressToBasicTicket[user].ticketExpirationDate > block.timestamp) {
            addressToBasicTicket[user].acumulativeValueOfTransactions += amount;
        }
    }

    function claimTokenFromAirdrop(bytes32[] memory merkleProof) external {
        require(
            canClaim(msg.sender, merkleProof),
            "MerkleAirdrop: Address is not a candidate for claim"
        );

        claimed[msg.sender] = true;
        this.safeMint(msg.sender);
    }

    function canClaim(address claimer, bytes32[] memory merkleProof) public view returns (bool) {
        return
            !claimed[claimer] &&
            MerkleProof.verify(
                merkleProof,
                airdropMerkleRoot,
                keccak256(abi.encodePacked(claimer))
            );
    }

    function isArtist(
        uint256 tokenId,
        address creatorArtist,
        bytes32[] memory proof
    ) public view returns (bool) {
        return
            MerkleProof.verify(
                proof,
                artistMerkleRoot,
                keccak256(abi.encodePacked(tokenId, creatorArtist))
            );
    }
}
