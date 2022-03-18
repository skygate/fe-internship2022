const axios = require("axios");
const { pinata } = require("../hardhat.config");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const recursive = require("recursive-fs");

// number of files to upload
const fileCounter = 3;

async function main() {
    // uplod PNG files and get IPFS Hash
    const pngPath = path.join(path.dirname(__dirname), "metadata\\png");
    const pngDirHash = await pinDirectoryToIPFS(pngPath);
    console.log(`PNG files uploded on pinata on ${pngDirHash}`);

    // Update matadata with PNG IPFS Hash
    for (let i = 1; i <= fileCounter; i++) {
        const rawData = fs.readFileSync(
            path.join(path.dirname(__dirname), "metadata\\json", `${i}.json`)
        );
        let parsedData = JSON.parse(rawData);
        parsedData["image"] = `ipfs://${pngDirHash}/${i}.png`;
        fs.writeFileSync(
            path.join(path.dirname(__dirname), "metadata\\json", `${i}.json`),
            JSON.stringify(parsedData, null, 2)
        );
    }

    // uplod JSON files and get IPFS Hash
    const jsonPath = path.join(path.dirname(__dirname), "metadata\\json");
    const jsonDirHash = await pinDirectoryToIPFS(jsonPath);
    console.log(`JSON files uploded on pinata on ${jsonDirHash}`);
}

async function pinDirectoryToIPFS(dirPath) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const fileType = path.basename(dirPath);
    let data = new FormData();
    let ipfsHash;

    for (let i = 1; i <= fileCounter; i++) {
        data.append("file", fs.createReadStream(dirPath + `/${i}.${fileType}`), {
            filepath: `/${fileType}/${i}.${fileType}`,
        });
    }

    await axios
        .post(url, data, {
            maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large directories
            headers: {
                "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: pinata.pinataApiKey,
                pinata_secret_api_key: pinata.pinataApiSecret,
            },
        })
        .then(function (response) {
            ipfsHash = response.data.IpfsHash;
        })
        .catch(function (error) {
            console.log(error);
        });
    return ipfsHash;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });