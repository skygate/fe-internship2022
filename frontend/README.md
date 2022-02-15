# Remember to be in ./frontend directory run frontend.
## First run
### Install all dependencies:
`npm install` 
### Run Frontend on localhost: 
`npm run dev`

Running with `nmp run dev` automatically refreshes app with new chenges in code.

## HardHat localhost node
To use contract on frontend you need to run HardHat node on localhost. To do this use comand: `npx hardhat node` or `hh node`. 

Later run deploy script on loclahost network: `hh run scripts/deploy.js --network localhost`. 

We also need to configure/modify localhost network on MetaMask.
* Network Name: `up to you`
* New RPC URL: `http://localhost:8545`
* Chain ID: `31337`
* Currency Symbol: `ETH`

And import given accounts by HardHat node to MetaMask.
## Why we run HardHat localhost node and deploy there contract?
Doing this we dont need to deploy contract everytime on test network and change addrress of contract. First deployed contract on HardHat local node will have the same address `0x5fbdb2315678afecb367f032d93f642f64180aa3`. 

# Adding new features on frontend
### To add new feature go to `MainContext.jsx`, create new `div` with `className='sectionX'`, add component inside created `div` and add new section in `mainContext.css`. Example for x=2:
```html
<div className="section2">
    <h2>Mint NFT</h2>
        <MintNFT /> <!-- component with logic -->
</div>
```
```css
.container{
    /* other properties */
    grid-template-areas:
      "section1 section1 section1" /* old */
      "section2 section2 section2"; /* added */
}
.section1 { grid-area: section1; } /* old */
.section2 { grid-area: section2; } /* added */
```