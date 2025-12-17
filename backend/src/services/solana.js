const {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
  PublicKey,
} = require("@solana/web3.js");

const { SOL_RPC, SOL_ESCROW_PRIVATE_KEY } = require("../config");

const connection = new Connection(SOL_RPC, "confirmed");

// ✅ FIX: parse JSON array private key (NO bs58)
const escrowSecret = Uint8Array.from(
  JSON.parse(SOL_ESCROW_PRIVATE_KEY)
);

const escrow = Keypair.fromSecretKey(escrowSecret);


console.log("🟣 SOL ESCROW:", escrow.publicKey.toBase58());


async function sendSOL(to, amountSol) {
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: escrow.publicKey,
      toPubkey: new PublicKey(to),
      lamports: Math.floor(amountSol * LAMPORTS_PER_SOL), // safety
    })
  );

  const sig = await connection.sendTransaction(tx, [escrow]);
  await connection.confirmTransaction(sig, "confirmed");

  return sig;
}

module.exports = { sendSOL };
