const axios = require("axios");

async function getRates() {
  const res = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price",
    {
      params: {
        ids: "ethereum,solana",
        vs_currencies: "usd",
      },
    }
  );

  const ethUsd = res.data.ethereum.usd;
  const solUsd = res.data.solana.usd;

  return {
    ETH_TO_SOL: ethUsd / solUsd,
    SOL_TO_ETH: solUsd / ethUsd,
  };
}

module.exports = { getRates };
