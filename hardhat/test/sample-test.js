const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftInternship", function () {
  it("Contructor creation", async function () {
    const NftInternship = await ethers.getContractFactory("NftInternship");
  })
});