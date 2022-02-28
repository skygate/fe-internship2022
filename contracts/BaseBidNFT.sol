// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BaseERC721.sol";

contract BaseBidNFT {
    enum TOKENSTATUS {
        Started,
        Ended
    }

    struct Auctions {
        address SellerNft;
        address HighBidder;
        uint256 HighestBid;
        uint256 StartBid;
        uint256 EndAt;

        TOKENSTATUS tokenStatus;
    }

    event Start(address owner, Auctions auction);
    event Bid(address sender, uint256 amount);
    event End(address winner, uint256 amount);
    event Withdraw(address bidder, uint256 amount);
    event Cancel(address highestbidder, uint256 amount);

    mapping(uint256 => mapping(address => uint256)) private userBalance;
    mapping(uint256 => uint256) private auctionBlance;
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
            msg.sender == auctions[tokenId].SellerNft,
            "You don't have permission to manage this token!"
        );

        _;
    }

    modifier isBidPossible(uint256 tokenId) {
        require(
            (msg.value + userBalance[tokenId][msg.sender]) >
                auctions[tokenId].StartBid,
            "value + your blance < minimal bid"
        );
        require(
            (msg.value + userBalance[tokenId][msg.sender]) >
                auctions[tokenId].HighestBid,
            "value + your blance < highest bid"
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
            address(0),
            0,
            _startingBid,
            auctionEndAt,
            TOKENSTATUS.Started
        );

        emit Start(msg.sender, auctions[tokenId]);
    }

    function bid(uint256 tokenId)
        public
        payable
        isBidPossible(tokenId)
        isAuctionNotEnded(tokenId)
    {
        auctions[tokenId].HighBidder = msg.sender;

        if (auctions[tokenId].HighBidder != address(0)) {
            auctions[tokenId].HighestBid = (msg.value +
                userBalance[tokenId][msg.sender]);
            auctionBlance[tokenId] += msg.value;
            userBalance[tokenId][msg.sender] += msg.value;
        }

        emit Bid(msg.sender, msg.value);
    }

    function withdraw(uint256 tokenId) public {
        auctionBlance[tokenId] -= userBalance[tokenId][msg.sender];
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
        uint256 balance = userBalance[tokenId][auctions[tokenId].HighBidder];
        auctions[tokenId].tokenStatus = TOKENSTATUS.Ended;

        baseERC721.transfer(
            address(this),
            auctions[tokenId].SellerNft,
            tokenId
        );

        emit Cancel(auctions[tokenId].HighBidder, balance);
        delete auctions[tokenId];
    }

    function end(uint256 tokenId)
        public
        isSeller(tokenId)
        isAuctionEnded(tokenId)
    {
        require(block.timestamp >= auctions[tokenId].EndAt, "Auction is ended");
        require(userBalance[tokenId][auctions[tokenId].HighBidder] == auctions[tokenId].HighestBid,"Highest bidder withdraw money befor end auction");

        auctions[tokenId].tokenStatus = TOKENSTATUS.Ended;
        uint256 balance = auctions[tokenId].HighestBid;
        auctions[tokenId].HighestBid = 0;

        auctionBlance[tokenId] -= userBalance[tokenId][auctions[tokenId].HighBidder];
        userBalance[tokenId][auctions[tokenId].HighBidder] = 0;

        if (auctions[tokenId].HighBidder != address(0)) {
            (bool success, ) = auctions[tokenId].SellerNft.call{value: balance}(
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
                auctions[tokenId].SellerNft,
                tokenId
            );
        }

        emit End(auctions[tokenId].HighBidder, balance);
        delete auctions[tokenId];
    }
}
