// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BaseERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Sales is Ownable {
    enum TOKENSTATUS {
        Started,
        Ended
    }

    struct Auctions {
        address sellerNft;
        address highBidder;
        uint256 highestBid;
        uint256 startBid;
        uint256 endAt;
        TOKENSTATUS tokenStatus;
    }

    struct Sale { 
        address seller;
        uint256 price;
    }

    event Start(address owner, Auctions auction, uint256 tokenId);
    event Bid(address sender, uint256 amount, uint256 tokenId);
    event End(address winner, uint256 amount, uint256 tokenId);
    event Withdraw(address bidder, uint256 amount, uint256 tokenId);
    event Cancel(address highestBidder, uint256 amount, uint256 tokenId);

    mapping(uint256 => mapping(address => uint256)) private userBalance;
    mapping(uint256 => Auctions) public auctions;
    mapping(uint256 => Sale) public tokenIdToSale;

    BaseERC721 private baseERC721;
    uint256 public adminFeeToWithdraw;

    constructor(address _baseERC721adders) {
        baseERC721 = BaseERC721(_baseERC721adders);
    }

        modifier isTokenOnSale(uint256 tokenId) {
        require(
            tokenIdToSale[tokenId].price > 0,
            "Cant perform this action, token is not on sale!"
        );
        _;
    }

    modifier isOwnerOfToken(uint256 tokenId) {
        require(
            baseERC721.ownerOf(tokenId) == msg.sender || tokenIdToSale[tokenId].seller == msg.sender,
            "Cant perform this action, you must be owner of this token!"
        );
        _;
    }

    modifier isAuctionNotEnded(uint256 tokenId) {
        require(auctions[tokenId].tokenStatus == TOKENSTATUS.Started, "The bidding period is over");
        require(block.timestamp <= auctions[tokenId].endAt, "The bidding period is over");

        _;
    }

    modifier isAuctionEnded(uint256 tokenId) {
        require(auctions[tokenId].tokenStatus == TOKENSTATUS.Started, "The bidding period is over");
        require(block.timestamp >= auctions[tokenId].endAt, "The bidding period has not ended");

        _;
    }

    modifier isBidPossible(uint256 tokenId, uint256 bidAmount) {
        require(
            (bidAmount + userBalance[tokenId][msg.sender]) >= auctions[tokenId].startBid,
            "The deposit is lower than the minimum possible bid"
        );
        require(
            (bidAmount + userBalance[tokenId][msg.sender]) > auctions[tokenId].highestBid,
            "The deposit is lower than the minimum possible bid"
        );
        require(
            msg.value >=
                bidAmount +
                    baseERC721.calculateAdminFee(msg.sender, bidAmount) +
                    baseERC721.calculateRoyaltiesFee(bidAmount),
            "You send not enougth ETH to pay for admin fee!"
        );

        _;
    }

    function createAuction(uint256 tokenId, uint256 _startingBid) public isOwnerOfToken(tokenId) {
        baseERC721.transfer(msg.sender, address(this), tokenId);

        uint256 auctionendAt = block.timestamp + 5 seconds;

        auctions[tokenId] = Auctions(
            msg.sender,
            address(0),
            0,
            _startingBid,
            auctionendAt,
            TOKENSTATUS.Started
        );

        emit Start(msg.sender, auctions[tokenId], tokenId);
    }

    function bidAuction(
        uint256 tokenId,
        uint256 bidAmount,
        address creatorArtist,
        bytes32[] memory proof
    ) public payable isBidPossible(tokenId, bidAmount) isAuctionNotEnded(tokenId) {
        require(baseERC721.isArtist(tokenId, creatorArtist, proof), "Invalid artist address!");
        uint256 adminFee = baseERC721.calculateAdminFee(msg.sender, bidAmount);
        uint256 royaltiesFee = baseERC721.calculateRoyaltiesFee(bidAmount);
        auctions[tokenId].highBidder = msg.sender;

        if (auctions[tokenId].highBidder != address(0)) {
            auctions[tokenId].highestBid = (bidAmount + userBalance[tokenId][msg.sender]);
            userBalance[tokenId][msg.sender] += bidAmount;
            adminFeeToWithdraw += adminFee;
            (bool success, ) = payable(creatorArtist).call{value: royaltiesFee}("");
            require(success, "Failed to send Ether");
            baseERC721.increaseAcumulativeValueOfTransactions(msg.sender, tokenId);
        }

        emit Bid(msg.sender, bidAmount, tokenId);
    }

    function withdraw(uint256 tokenId) public isAuctionEnded(tokenId) {
        uint256 balance = userBalance[tokenId][msg.sender];
        userBalance[tokenId][msg.sender] = 0;

        if (auctions[tokenId].highBidder == msg.sender) {
            auctions[tokenId].highBidder = address(0);
        }

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Failed to send Ether");

        emit Withdraw(msg.sender, balance, tokenId);
    }

    function withdrawAdminFee() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: adminFeeToWithdraw}("");
        require(success, "Transfer failed.");
        adminFeeToWithdraw = 0;
    }

    function cancelAuction(uint256 tokenId) public isAuctionNotEnded(tokenId) {
        require(
            auctions[tokenId].tokenStatus == TOKENSTATUS.Started,
            "You cannot cancel an auction that has not started"
        );
        require(
            msg.sender == auctions[tokenId].sellerNft || owner() == msg.sender,
            "You are not allowed to end this auction."
        );

        uint256 balance = userBalance[tokenId][auctions[tokenId].highBidder];
        auctions[tokenId].tokenStatus = TOKENSTATUS.Ended;

        baseERC721.transfer(address(this), auctions[tokenId].sellerNft, tokenId);

        emit Cancel(auctions[tokenId].highBidder, balance, tokenId);
        delete auctions[tokenId];
    }

    function endAuction(uint256 tokenId) public isAuctionEnded(tokenId) {
        require(auctions[tokenId].endAt != 0, "You cannot end an auction that has not started");
        require(
            msg.sender == auctions[tokenId].sellerNft || owner() == msg.sender,
            "You are not allowed to end this auction."
        );
        require(
            userBalance[tokenId][auctions[tokenId].highBidder] == auctions[tokenId].highestBid,
            "Highest bidder withdraw money befor end auction"
        );

        auctions[tokenId].tokenStatus = TOKENSTATUS.Ended;
        uint256 balance = auctions[tokenId].highestBid;
        auctions[tokenId].highestBid = 0;

        userBalance[tokenId][auctions[tokenId].highBidder] = 0;

        if (auctions[tokenId].highBidder != address(0)) {
            (bool success, ) = auctions[tokenId].sellerNft.call{value: balance}("");
            require(success, "Failed to send Ether");
            baseERC721.transfer(address(this), auctions[tokenId].highBidder, tokenId);
        } else {
            baseERC721.transfer(address(this), auctions[tokenId].sellerNft, tokenId);
        }

        emit End(auctions[tokenId].highBidder, balance, tokenId);
        delete auctions[tokenId];
    }

    function startSale(uint256 tokenId, uint256 price) public isOwnerOfToken(tokenId) {
        require(price > 0, "Can not sale for 0 ETH!");
        tokenIdToSale[tokenId] = Sale(msg.sender, price);
        baseERC721.transfer(msg.sender, address(this), tokenId);
    }

    function cancelSale(uint256 tokenId) public isTokenOnSale(tokenId) isOwnerOfToken(tokenId) {
        baseERC721.transfer(address(this), msg.sender, tokenId);
        delete tokenIdToSale[tokenId];
    }

    function buyTokenOnSale(
        uint256 tokenId,
        address creatorArtist,
        bytes32[] memory proof
    ) external payable isTokenOnSale(tokenId) {
        uint256 adminFee = baseERC721.calculateAdminFee(msg.sender, tokenIdToSale[tokenId].price);
        uint256 royaltiesFee = baseERC721.calculateRoyaltiesFee(tokenIdToSale[tokenId].price);
        require(baseERC721.isArtist(tokenId, creatorArtist, proof), "Invalid artist address!");
        require(
            tokenIdToSale[tokenId].price + adminFee + royaltiesFee <= msg.value,
            "Pleas provide minimum price of this specific token!"
        );
        baseERC721.transfer(address(this), msg.sender, tokenId);
        (bool success, ) = payable(tokenIdToSale[tokenId].seller).call{
            value: tokenIdToSale[tokenId].price
        }("");
        require(success, "Failed to send Ether");
        baseERC721.increaseAcumulativeValueOfTransactions(msg.sender, tokenIdToSale[tokenId].price);
        adminFeeToWithdraw += adminFee;
        (success, ) = payable(creatorArtist).call{value: royaltiesFee}("");
        require(success, "Failed to send Ether");
        delete tokenIdToSale[tokenId].price;
        delete tokenIdToSale[tokenId].seller;
    }
}
