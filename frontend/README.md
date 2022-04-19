# How to run frontend?

## First run

### Install all dependencies:

`npm install`

### Run Frontend on localhost:

`npm run dev`

Running with `nmp run dev` automatically refreshes app with new chenges in code. **REMEMBER to be inside ./frontend directory to run it.**

## HardHat localhost node

To use contract on frontend you need to run HardHat node on localhost. To do this use comand: `npx hardhat node` or `hh node`.

Later run deploy script on loclahost network: `npx hardhat run scripts/deploy.js --network localhost`.

We also need to configure/modify localhost network on MetaMask.

-   Network Name: `up to you`
-   New RPC URL: `http://localhost:8545`
-   Chain ID: `31337`
-   Currency Symbol: `ETH`

And import given accounts by HardHat node to MetaMask.

## Why we run HardHat localhost node and deploy there contract?

Doing this we dont need to deploy contract everytime on test network and change addrress of contract. First deployed contract on HardHat local node will have the same address `0x5fbdb2315678afecb367f032d93f642f64180aa3`.

# How to add things to frontend?

## Adding connection to contract

In `./frotend/src` is file `helpers.jsx`. You can find there fucntion `getContractComponents` that returns `[address, provider, signer, contract]` and you dont need to impement in yourself. In component just import it and call this function.

```js
import { getContractComponents } from "../../helpers.jsx";

const BurnToken = () => {
    const burnToken = async () => {
        const [address, provider, signer, contract] = getContractComponents();
        // code to interact with contract
    };

    return <h1>BurnToken</h1>;
};

export default BurnToken;
```
