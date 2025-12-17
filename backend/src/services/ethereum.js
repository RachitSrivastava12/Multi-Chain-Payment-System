const { ethers } = require("ethers");
const { ETH_RPC, ETH_ESCROW_PRIVATE_KEY } = require("../config");

const provider = new ethers.JsonRpcProvider(ETH_RPC);
const wallet = new ethers.Wallet(ETH_ESCROW_PRIVATE_KEY, provider);

async function sendETH(to, amountEth) {
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amountEth.toString()),
  });

  await tx.wait();
 
   
   console.log("send eth to my custodian ", tx.hash)
  

  return tx.hash;


}

module.exports = { sendETH };
