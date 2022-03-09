// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MockWETH9.sol";

/// @title Exchange Accountant
/// @author Jakub Szymański
/// @notice Accountant responsible for chash flow in and out of Exchange.
contract ExchangeBalanceAccountant is Ownable {
    uint256 public exchangeETHBalance; // Balance of ethereum of whole exchange.
    uint256 public exchangeWETHBalance; // Balance of wrapperd ethereum of whole exchange.
    uint8 _decimals = 18;
    uint256 public MAX_AMOUNT = (~uint256(0)) / 2;
    MockWETH9 wETH;

    mapping(address => uint256) public eTHBalances;
    mapping(address => uint256) public wETHBalances;

    constructor(address payable wETH_) {
        wETH = MockWETH9(wETH_);
    }

    /// @notice Mints exchange ethereum from normal ethereum. ~Jakub Szymański
    /// @param to - address at which exchange ethereum value will be assigned.
    function mintETH(address to) public payable {
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
    function mintWETH(address to, uint256 amount) public {
        require(
            exchangeWETHBalance + amount <= MAX_AMOUNT,
            "Maximum ethereum capacity of smartcontract has been reached."
        );
        wETHBalances[to] += amount;
        wETH.transferFrom(msg.sender, address(this), amount);
        exchangeWETHBalance += amount;
    }

    /// @notice Sends wrapped ethereum from exchange wallet to given address.
    /// @param to - address from which exchange ethereum value will be send.
    /// @param amount - amount of exchange ethereum that will be burned.
    function burnETH(address payable to, uint256 amount) public {
        require(
            eTHBalances[to] >= amount,
            "This account has too low ethereum balance on exchange to perform 'burn' opreation."
        );
        eTHBalances[to] -= amount;
        exchangeETHBalance -= amount;
        to.transfer(amount);
    }

    /// @notice Sends wrapped ethereum from exchange wallet to given address.
    /// @param to - address from which exchange ethereum value will be send.
    function burnWETH(address to, uint256 amount) public {
        require(
            wETHBalances[to] >= amount,
            "This account has too low wrappend etherum balance on exchange to perform 'burn' opreation."
        );
        wETHBalances[to] -= amount;
        exchangeWETHBalance -= amount;
        wETH.transfer(to, amount);
    }

    function getETHBalance(address _of) public view returns (uint256) {
        return eTHBalances[_of];
    }

    function getWETHBalance(address _of) public view returns (uint256) {
        return wETHBalances[_of];
    }

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
