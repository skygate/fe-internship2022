// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MockAggregator {
  int256 public s_answer = 1337 * 10**17;

  function setLatestAnswer(int256 answer) public {
    s_answer = answer;
  }

  function latestRoundData() public view returns 
    (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
    return (0, s_answer, 0, 0, 0);
  }
}