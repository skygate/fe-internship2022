# NFT internship using HARDHAT
## Test structure
Each contract should have separate file for tests. Inside should be one `describe` for all tests and nested `describe` for each functionalities. Inside nested `describe` are outed test logic within `it`. Name of every test should have result(`PASS` or `FAIL`) and short description if needed.
```js
describe("TEST BaseERC721", async () => {
    describe("TEST payToMint()", async () => {
        it("PASS", async () => {
            // test logic
        });
    });

    describe("TEST safeMint()", async () => {
        it("PASS - for owner", async () => {
            // test logic
        });

        it("FAIL - for not owner", async () => {
            // test logic
        });
    });
});
```