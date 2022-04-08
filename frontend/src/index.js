import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MoralisProvider } from "react-moralis";
import secret from "./secret";

ReactDOM.render(
    <MoralisProvider appId={secret.MORALIS_APP_ID} serverUrl={secret.MORALIS_SERVER_URL}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </MoralisProvider>,
    document.getElementById("root")
);

/*
MyMockV3Aggregator address: 0x4F9d1494ba015A870eB114bC6341a119F96212B4
BaseERC721 address: 0xFC4606F0a077d170BA3A6Cf9FEc3fDd7B4c73612
BaseBidNFT address: 0x73A87E4A073fE2d201f5CC08599378d3008b2496
*/

reportWebVitals();