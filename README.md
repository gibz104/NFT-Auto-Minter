# NFT-Auto-Minter
This script will: 
1. Connect to a geth node
2. Subscribe to block events
3. Call NFT smart contract state
4. Send tx to mint NFT once minting is active 


This code was built to mint NFTs for an Ethereum project called "Kaiju Kingz", but can be adapted for other NFT smart contract mints.  Kaiju Kingz NFT required the smart contract owner to send a transaction to the smart contract to enable the NFT minting process.  Once minting was enabled, anyone could send a transaction to their smart contract to mint an NFT (up to the max supply).
