// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BaseERC721.sol";
import "hardhat/console.sol";

contract BaseBidNFT {
    enum TOKENSTATUS {
        Started,
        Ended
    }

    struct Auctions {
        address sellerNft;
        address HighBidder;
        uint256 HighestBid;
        uint256 startBid;
        uint256 EndAt;
        uint256 auctionBlance;
        TOKENSTATUS tokenStatus;
    }

    event Start(Auctions auction);
    event End(address winner, uint256 amount);
    event Cancel(uint256 amount);
    event Bid(address indexed sender, uint256 amount);
    event Withdraw(address indexed bidder, uint256 amount);

    mapping(uint256 => mapping(address => uint256)) private userBalance;
    mapping(uint256 => Auctions) private auctions;

    BaseERC721 private baseERC721;

    constructor(address _baseERC721adders) {
        baseERC721 = BaseERC721(_baseERC721adders);
    }

    modifier isOwnerOfToken(uint256 tokenId) {
        require(
            baseERC721._ownerOfToken(tokenId) == msg.sender,
            "Cant perform this action, you must be owner of this token!"
        );
        _;
    }

    modifier isAuctionNotEnded(uint256 tokenId) {
        require(
            auctions[tokenId].tokenStatus == TOKENSTATUS.Started,
            "The bidding period is over"
        );
        require(
            block.timestamp <= auctions[tokenId].EndAt,
            "The bidding period is over"
        );

        _;
    }

    modifier isAuctionEnded(uint256 tokenId) {
        require(
            auctions[tokenId].tokenStatus == TOKENSTATUS.Started,
            "The bidding period is over"
        );
        require(
            block.timestamp >= auctions[tokenId].EndAt,
            "The bidding period has not ended"
        );

        _;
    }

    modifier isSeller(uint256 tokenId) {
        require(
            msg.sender == auctions[tokenId].sellerNft,
            "You don't have permission to manage this token!"
        );

        _;
    }

    modifier isBidPossible(uint256 tokenId) {
        require(
            (msg.value + userBalance[tokenId][msg.sender]) >
                auctions[tokenId].startBid,
            "value + your blance < minimal bid"
        );
        require(
            (msg.value + userBalance[tokenId][msg.sender]) >
                auctions[tokenId].HighestBid,
            "value + your blance < highest"
        );

        _;
    }

    function createAuction(uint256 tokenId, uint256 _startingBid)
        public
        isOwnerOfToken(tokenId)
    {
        baseERC721.transfer(msg.sender, address(this), tokenId);

        uint256 auctionEndAt = block.timestamp + 5 seconds;

        auctions[tokenId] = Auctions(
            msg.sender,
            msg.sender,
            0,
            _startingBid,
            auctionEndAt,
            0,
            TOKENSTATUS.Started
        );

        emit Start(auctions[tokenId]);
    }

    function bid(uint256 tokenId)
        public
        payable
        isBidPossible(tokenId)
        isAuctionNotEnded(tokenId)
    {
        auctions[tokenId].HighBidder = msg.sender;

        if (auctions[tokenId].HighBidder != address(0)) {
            auctions[tokenId].auctionBlance += msg.value;
            auctions[tokenId].HighestBid = (msg.value +
                userBalance[tokenId][msg.sender]);
            userBalance[tokenId][msg.sender] += msg.value;
        }

        emit Bid(msg.sender, msg.value);
    }

    function withdraw(uint256 tokenId) public {
        auctions[tokenId].auctionBlance -= userBalance[tokenId][msg.sender];
        uint256 balance = userBalance[tokenId][msg.sender];
        userBalance[tokenId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Failed to send Ether");

        emit Withdraw(msg.sender, balance);
    }

    function cancel(uint256 tokenId)
        public
        isAuctionNotEnded(tokenId)
        isSeller(tokenId)
    {
        auctions[tokenId].tokenStatus = TOKENSTATUS.Ended;

        baseERC721.transfer(
            address(this),
            auctions[tokenId].sellerNft,
            tokenId
        );

        delete auctions[tokenId];
        emit Cancel(tokenId);
    }

    function end(uint256 tokenId)
        public
        isSeller(tokenId)
        isAuctionEnded(tokenId)
    {
        require(block.timestamp >= auctions[tokenId].EndAt, "Auction is ended");

        auctions[tokenId].tokenStatus = TOKENSTATUS.Ended;

        if (auctions[tokenId].HighBidder != address(0)) {
            uint256 balance = auctions[tokenId].HighestBid;
            auctions[tokenId].HighestBid = 0;

            (bool success, ) = auctions[tokenId].sellerNft.call{value: balance}(
                ""
            );
            require(success, "Failed to send Ether");

            baseERC721.transfer(
                address(this),
                auctions[tokenId].HighBidder,
                tokenId
            );
        } else {
            baseERC721.transfer(
                address(this),
                auctions[tokenId].sellerNft,
                tokenId
            );
        }
        delete auctions[tokenId];

        emit End(auctions[tokenId].HighBidder, auctions[tokenId].HighestBid);
    }
}
