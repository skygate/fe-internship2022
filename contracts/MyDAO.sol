// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title DAO to govern the Marketplace
/// @author Amit Dua
/// @notice Purpose of MyDAO: is decentalization of the governing of the marketplace.
/// @dev Based on some ERC20 governance token.
contract MyDAO {
    
    enum VotingOptions { Yes, No }
    enum Status { Accepted, Rejected, Pending }
    struct Proposal {
        uint256 id;
        address author;
        string name;
        uint256 createdAt;
        uint256 votesForYes;
        uint256 votesForNo;
        Status status;
    }

    // store all proposals
    mapping(uint => Proposal) public proposals;
    // who already votes for who and to avoid vote twice
    mapping(address => mapping(uint => bool)) public votes;
    // one share for governance tokens
    mapping(address => uint256) public shares;
    uint public totalShares;
    // the IERC20 allow us to use avax like our governance token.
    IERC20 public token;
    // the user need minimum to create a proposal.
    uint constant CREATE_PROPOSAL_MIN_SHARE = 1*10**16;
    uint constant VOTING_PERIOD = 50 seconds;
    uint public nextProposalId;
    
    constructor(address erc20_contract_) {
        token = IERC20(erc20_contract_); // address
    }
    
    /// @notice Minting the governance tokens.
    /// @param _amount - uint type
    function deposit(uint _amount) external payable {
        shares[msg.sender] += _amount;
        totalShares += _amount;
        token.transferFrom(msg.sender, address(this), _amount);
    }
    

    function withdraw(uint _amount) external {
        require(shares[msg.sender] >= _amount, 'Not enough shares');
        shares[msg.sender] -= _amount;
        totalShares -= _amount;
        token.transfer(msg.sender, _amount);
    }

    function createProposal(string memory name) external {
    // validate the user has enough shares to create a proposal
    require(shares[msg.sender] >= CREATE_PROPOSAL_MIN_SHARE, 'Not enough shares to create a proposal');
    
    proposals[nextProposalId] = Proposal(
        nextProposalId,
        msg.sender,
        name,
        block.timestamp,
        0,
        0,
        Status.Pending
    );
    nextProposalId++;
    }

    /// @notice Vote for the proposal created and check whether the propsal is accepted based on number of 'Yes' OR .No'.
    /// @param _proposalId Id of the proposal
    /// @param _vote enum voting option with Yes or No
    function vote(uint _proposalId, VotingOptions _vote) external {
        Proposal storage proposal = proposals[_proposalId];
        require(votes[msg.sender][_proposalId] == false, 'already voted');
        require(block.timestamp <= proposal.createdAt + VOTING_PERIOD, 'Voting period is over');
        votes[msg.sender][_proposalId] = true;
        if(_vote == VotingOptions.Yes) {
            proposal.votesForYes += shares[msg.sender];
            if(proposal.votesForYes * 100 / totalShares > 50) {
                proposal.status = Status.Accepted;
            }
        } else {
            proposal.votesForNo += shares[msg.sender];
            if(proposal.votesForNo * 100 / totalShares > 50) {
                proposal.status = Status.Rejected;
            }
        }
    }
}