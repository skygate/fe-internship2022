// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MockWETH9.sol";

/// @title Exchange Accountant
/// @author Jakub Szymański
/// @notice Accountant responsible for chash flow in and out of Exchange.
contract ExchangeBalanceAccountant is Ownable {
    uint256 public exchangeETHBalance; // Balance of ethereum of whole exchange.
    uint256 public exchangeWETHBalance; // Balance of wrapperd ethereum of whole exchange.
    uint256 public constant MAX_AMOUNT = (~uint256(0)) / 2;
    WETH9 wETH;

    mapping(address => uint256) public eTHBalances;
    mapping(address => uint256) public wETHBalances;

    constructor(address payable wETH_) {
        wETH = WETH9(wETH_);
    }

    /// @notice Mints exchange ethereum from normal ethereum. ~Jakub Szymański
    /// @param to - address at which exchange ethereum value will be assigned.
    function depositETH(address to) public payable {
        require(
            exchangeETHBalance + msg.value <= MAX_AMOUNT,
            "Maximum ethereum capacity of smartcontract has been reached."
        );
        eTHBalances[to] += msg.value;
        exchangeETHBalance += msg.value;
    }

    /// @notice Mints Exchange ethereum from wrapped ethereum.
    /// @param to - address at which exchange ethereum value will be assigned.
    /// @param amount - amount of exchange wrapped ethereum that will be minted.
    function depositWETH(address to, uint256 amount) public {
        require(
            exchangeWETHBalance + amount <= MAX_AMOUNT,
            "Maximum ethereum capacity of smartcontract has been reached."
        );
        wETHBalances[to] += amount;
        wETH.transferFrom(msg.sender, address(this), amount);
        exchangeWETHBalance += amount;
    }

    /// @notice Sends wrapped ethereum from exchange wallet to given address.
    /// @param amount - amount of exchange ethereum that will be burned.
    function withdrawETH(uint256 amount) public {
        require(
            eTHBalances[payable(msg.sender)] >= amount,
            "This account has too low ethereum balance on exchange to perform 'burn' opreation."
        );
        eTHBalances[payable(msg.sender)] -= amount;
        exchangeETHBalance -= amount;
        payable(msg.sender).transfer(amount);
    }

    /// @notice Sends wrapped ethereum from exchange wallet to given address.
    /// @param amount - amount of exchange ethereum value to burn.
    function withdrawWETH(uint256 amount) public {
        require(
            wETHBalances[msg.sender] >= amount,
            "This account has too low wrappend etherum balance on exchange to perform 'burn' opreation."
        );
        wETHBalances[msg.sender] -= amount;
        exchangeWETHBalance -= amount;
        wETH.transfer(msg.sender, amount);
    }

    /// @notice Returns value of all types of ethereum on exchange.
    /// @return uint256 - value of all types of ethereum on exchange
    function totalSupply() public view returns (uint256) {
        return exchangeETHBalance + exchangeWETHBalance;
    }

    /// @notice Sends wrapped ethereum from exchange wallet to given address.
    /// @param to - address from which exchange ethereum value will be send.
    /// @param amount - amount of exchange ethereum that will be send inside exchange balances.
    /// @param usingWETH - boolean that indicates usage of wrapped ethereum.
    function innerTransfer(
        address to,
        uint256 amount,
        bool usingWETH
    ) public {
        if (usingWETH) {
            require(
                wETHBalances[msg.sender] >= amount,
                "This account has too low wrapped ethereum balance on exchange to perform 'innerTransfer' opreation."
            );
            wETHBalances[msg.sender] -= amount;
            wETHBalances[to] += amount;
        } else {
            require(
                eTHBalances[msg.sender] >= amount,
                "This account has too low ethereum balance on exchange to perform 'innerTransfer' opreation."
            );
            eTHBalances[msg.sender] -= amount;
            eTHBalances[to] += amount;
        }
    }
}
