require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 4000,
  DATABASE_URL: process.env.DATABASE_URL,

  ETH_RPC: process.env.ETH_RPC,
  SOL_RPC: process.env.SOL_RPC,

  ETH_ESCROW_PRIVATE_KEY: process.env.ETH_ESCROW_PRIVATE_KEY,
  SOL_ESCROW_PRIVATE_KEY: process.env.SOL_ESCROW_PRIVATE_KEY,

  JWT_SECRET: process.env.JWT_SECRET || "jwtkasecret",
};
