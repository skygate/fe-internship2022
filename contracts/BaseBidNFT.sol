// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BaseERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseBidNFT is Ownable {
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

    event Start(address owner, Auctions auction, uint256 tokenId);
    event Bid(address sender, uint256 amount, uint256 tokenId);
    event End(address winner, uint256 amount, uint256 tokenId);
    event Withdraw(address bidder, uint256 amount, uint256 tokenId);
    event Cancel(address highestBidder, uint256 amount, uint256 tokenId);

    mapping(uint256 => mapping(address => uint256)) private userBalance;
    mapping(uint256 => uint256) private auctionBlance;
    mapping(uint256 => Auctions) public auctions;

    BaseERC721 private baseERC721;
    uint256 public ownerFeeToWithdraw;

    constructor(address _baseERC721adders) {
        baseERC721 = BaseERC721(_baseERC721adders);
    }

    modifier isOwnerOfToken(uint256 tokenId) {
        require(
            baseERC721.ownerOf(tokenId) == msg.sender,
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
            msg.value >= bidAmount + baseERC721.calculateTransactionFee(msg.sender, bidAmount),
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

    function bidAuction(uint256 tokenId, uint256 bidAmount)
        public
        payable
        isBidPossible(tokenId, bidAmount)
        isAuctionNotEnded(tokenId)
    {
        auctions[tokenId].highBidder = msg.sender;

        if (auctions[tokenId].highBidder != address(0)) {
            auctions[tokenId].highestBid = (bidAmount + userBalance[tokenId][msg.sender]);
            auctionBlance[tokenId] += bidAmount;
            userBalance[tokenId][msg.sender] += bidAmount;
            ownerFeeToWithdraw += msg.value - bidAmount;
            baseERC721.increaseAcumulativeValueOfTransactions(msg.sender, tokenId);
        }

        emit Bid(msg.sender, bidAmount, tokenId);
    }

    function withdraw(uint256 tokenId) public isAuctionEnded(tokenId) {
        auctionBlance[tokenId] -= userBalance[tokenId][msg.sender];
        uint256 balance = userBalance[tokenId][msg.sender];
        userBalance[tokenId][msg.sender] = 0;

        if (auctions[tokenId].highBidder == msg.sender) {
            auctions[tokenId].highBidder = address(0);
        }

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Failed to send Ether");

        emit Withdraw(msg.sender, balance, tokenId);
    }

    function withdrawOwnerFee() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: ownerFeeToWithdraw}("");
        require(success, "Transfer failed.");
        ownerFeeToWithdraw = 0;
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

        auctionBlance[tokenId] -= userBalance[tokenId][auctions[tokenId].highBidder];
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
}
