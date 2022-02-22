// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BaseERC721.sol";
import "hardhat/console.sol";

contract BaseBidNFT {
    enum AuctionStatus {
        Started,
        Ended,
        none
    }

    event Start();
    event End(address winner, uint256 amount);
    event Bid(address indexed sender, uint256 amount);
    event Withdraw(address indexed bidder, uint256 amount);

    mapping(address => uint256) private bids;
    mapping(uint256 => uint256) private tokenIdToEndAt;
    mapping(uint256 => uint256) private tokenIdToHighestBid;
    mapping(uint256 => uint256) private startingBid;

    mapping(uint256 => address) private sellerNft;
    mapping(uint256 => address) private tokenIdToHighBidder;

    mapping(uint256 => mapping(address => uint256)) private sendedMoneyToAuction;

    mapping(uint256 => AuctionStatus) private tokenIdStatus;

    BaseERC721 private baseERC721;

    constructor(address _baseERC721adders) {
        baseERC721 = BaseERC721(_baseERC721adders);
    }

    function createAuction(uint256 tokenId, uint256 _startingBid) public {
        baseERC721.transfer(msg.sender, address(this), tokenId);

        tokenIdToHighestBid[tokenId] = _startingBid;
        sellerNft[tokenId] = payable(msg.sender);
        tokenIdStatus[tokenId] = AuctionStatus.none;
    }

    function start(uint256 tokenId) public {
        require(
            tokenIdStatus[tokenId] != AuctionStatus.Started,
            "Auction started"
        );
        require(payable(msg.sender) == sellerNft[tokenId], "not seller");

        tokenIdStatus[tokenId] = AuctionStatus.Started;
        tokenIdToEndAt[tokenId] = block.timestamp + 5 seconds;
        bids[payable(msg.sender)] = 0;


        emit Start();
    }

    function bid(uint256 tokenId) public payable {
        require(tokenIdStatus[tokenId] == AuctionStatus.Started, "not started");
        require(block.timestamp < tokenIdToEndAt[tokenId], "ended");
        require((msg.value + sendedMoneyToAuction[tokenId][msg.sender]) > tokenIdToHighestBid[tokenId], "value < highest");

        tokenIdToHighBidder[tokenId] = payable(msg.sender);

        if (tokenIdToHighBidder[tokenId] != address(0)) {
            bids[sellerNft[tokenId]] += msg.value;
            sendedMoneyToAuction[tokenId][msg.sender] = msg.value;
            tokenIdToHighestBid[tokenId] = msg.value;
        }

        emit Bid(msg.sender, msg.value);
    }

    function withdraw(uint256 tokenId) public {
        bids[sellerNft[tokenId]] -= sendedMoneyToAuction[tokenId][msg.sender];
        uint256 balance = sendedMoneyToAuction[tokenId][msg.sender];
        sendedMoneyToAuction[tokenId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Failed to send Ether");

        emit Withdraw(msg.sender, balance);
    }

    function end(uint256 tokenId) public {
        require(tokenIdStatus[tokenId] == AuctionStatus.Started, "not started");
        require(block.timestamp >= tokenIdToEndAt[tokenId], "not ended");
        require(tokenIdStatus[tokenId] != AuctionStatus.Ended, "Ended");
        require(payable(msg.sender) == sellerNft[tokenId], "not seller");

        tokenIdStatus[tokenId] = AuctionStatus.Ended;

        if (tokenIdToHighBidder[tokenId] != address(0)) {
            uint256 balance = tokenIdToHighestBid[tokenId];
            tokenIdToHighestBid[tokenId] = 0;

            (bool success, ) = sellerNft[tokenId].call{value: balance}("");
            require(success, "Failed to send Ether");

            baseERC721.transfer(
                address(this),
                tokenIdToHighBidder[tokenId],
                tokenId
            );

        } else {
            baseERC721.transfer(
                address(this),
                sellerNft[tokenId],
                tokenId
            );
        }

        emit End(tokenIdToHighBidder[tokenId], tokenIdToHighestBid[tokenId]);
    }
}