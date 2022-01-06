require('dotenv').config();
const { API_URL_PROD, PRIVATE_KEY } = process.env;
const Web3 = require('web3');
const web3 = new Web3(API_URL_PROD);
const myAddress = '0xYourAddress';
const KAIJU_ABI = require("./abi.json");
const KAIJU_ADDRESS = "0x1685133a98e1d4fc1fe8e25b7493d186c37b6b24"; // NFT smart contract address

var TX_SENT = false;

const Kaiju = new web3.eth.Contract(KAIJU_ABI, KAIJU_ADDRESS);
const mintFunction = "0xa0712d68";
const mintAmount = 5;

async function sendTx(cost) {
    // Send mint transaction with predefined gas
    const _price = cost;
    const valueETH = _price * mintAmount;
    const nonce = await web3.eth.getTransactionCount(myAddress, 'latest');

    const transaction = {
        'to': KAIJU_ADDRESS,
        'value': valueETH,
        'gas': 750000,
        'gasPrice': 100000000000,
        'nonce': nonce,
        'data' : '0xa0712d680000000000000000000000000000000000000000000000000000000000000005'
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
}

async function main() {
    // Create new geth subscription for new blocks
    var subscription = web3.eth.subscribe('newBlockHeaders');

    // Check to make sure connection is made
    subscription.on("connected", function (subscriptionId) {
        console.log("Connected to subscription!  ID: ", subscriptionId);
    });

    // Handle error if not connected
    subscription.on("error", console.error);

    // When a new block is received...
    subscription.on("data", async function (blockHeader) {
        console.log("Block: ", blockHeader.number);

        // Get current NFT mint price
        var price = await Kaiju.methods.price().call();

        // Get boolean if minting is active
        var saleActive = await Kaiju.methods.saleActive().call();

        // Get total NFTs already minted
        var totalSupply = await Kaiju.methods.totalSupply().call();
        console.log(saleActive, " : ", totalSupply, " : ", web3.utils.fromWei(price, "ether"), " ETH");

        // Send transaction to mint if sale is active and tx has not been sent yet
        //   totalSupply check is avoid minting when there are none left to mint
        if (saleActive == true && TX_SENT == false && totalSupply <= 3200)  {
            TX_SENT = true;
            const receipt = await sendTx(price);
            console.log("The hash of your transaction is: ", receipt.transactionHash);
        };
    });
}

main();
