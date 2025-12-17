

const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const { getRates } = require("../services/pricing");
const { sendETH } = require("../services/ethereum");
const { sendSOL } = require("../services/solana");

const router = express.Router();

// router.post("/send", auth, async (req, res) => {
//   try {
//     let { receiverUsername, senderChain, amount } = req.body;

//     if (!receiverUsername || !senderChain || !amount) {
//       return res.status(400).json({ error: "Missing fields" });
//     }

//     // 🔥 NORMALIZE INPUT
//     senderChain = senderChain.toLowerCase();

//     if (!["sol", "eth"].includes(senderChain)) {
//       return res.status(400).json({ error: "Invalid sender chain" });
//     }

//     // receiver
//     const recvRes = await pool.query(
//       "SELECT username, preferred_chain, preferred_address FROM users WHERE username=$1",
//       [receiverUsername]
//     );

//     const receiver = recvRes.rows[0];
//     if (!receiver) {
//       return res.status(404).json({ error: "Receiver not found" });
//     }

//     if (!receiver.preferred_address) {
//       return res.status(400).json({ error: "Receiver wallet missing" });
//     }

//     // 🔥 NORMALIZE RECEIVER CHAIN
//     const settleChain = receiver.preferred_chain.toLowerCase();

//     if (!["sol", "eth"].includes(settleChain)) {
//       return res.status(400).json({ error: "Invalid receiver chain" });
//     }

//     // rates
//     const rates = await getRates();
//     let payout = amount;

//     if (senderChain !== settleChain) {
//       payout =
//         senderChain === "eth"
//           ? amount * rates.ETH_TO_SOL
//           : amount * rates.SOL_TO_ETH;
//     }

//     // send funds
//     const txHash =
//       settleChain === "eth"
//         ? await sendETH(receiver.preferred_address, payout)
//         : await sendSOL(receiver.preferred_address, payout);

//     // save payment
//     await pool.query(
//       `INSERT INTO payments
//        (sender_username, receiver_username, sender_chain, settle_chain,
//         input_amount, output_amount, receiver_address, tx_hash)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
//       [
//         req.user.username,
//         receiver.username,
//         senderChain,      // ✅ lowercase
//         settleChain,      // ✅ lowercase
//         amount,
//         payout,
//         receiver.preferred_address,
//         txHash,
//       ]
//     );

//     res.json({ success: true, txHash, payout });
//   } catch (err) {
//     console.error("❌ PAYMENT ERROR:", err);
//     res.status(500).json({ error: "Payment failed" });
//   }
// });

router.post("/send", auth, async (req, res) => {
  console.log("🟩 /payments/send HIT")
  console.log("🟩 Auth user:", req.user)
  console.log("🟩 Raw body:", req.body)

  try {
    let { receiverUsername, senderChain, amount } = req.body

    if (!receiverUsername || !senderChain || !amount) {
      console.warn("🟩 Missing fields", req.body)
      return res.status(400).json({ error: "Missing fields" })
    }

    senderChain = senderChain.toLowerCase()
    console.log("🟩 Normalized senderChain:", senderChain)

    if (!["sol", "eth"].includes(senderChain)) {
      console.warn("🟩 Invalid sender chain:", senderChain)
      return res.status(400).json({ error: "Invalid sender chain" })
    }

    console.log("🟩 Looking up receiver:", receiverUsername)

    const recvRes = await pool.query(
      "SELECT username, preferred_chain, preferred_address FROM users WHERE username=$1",
      [receiverUsername]
    )

    const receiver = recvRes.rows[0]
    console.log("🟩 Receiver DB result:", receiver)

    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" })
    }

    if (!receiver.preferred_address) {
      return res.status(400).json({ error: "Receiver wallet missing" })
    }

    const settleChain = receiver.preferred_chain.toLowerCase()
    console.log("🟩 settleChain:", settleChain)

    const rates = await getRates()
    console.log("🟨 Exchange rates:", rates)

    let payout = amount

    if (senderChain !== settleChain) {
      payout =
        senderChain === "eth"
          ? amount * rates.ETH_TO_SOL
          : amount * rates.SOL_TO_ETH
    }

    console.log("🟩 Final payout:", payout)

    console.log("🟨 Sending funds...")
    const txHash =
      settleChain === "eth"
        ? await sendETH(receiver.preferred_address, payout)
        : await sendSOL(receiver.preferred_address, payout)

    console.log("🟨 TX HASH:", txHash)

    console.log("🟩 Inserting payment record")

    await pool.query(
      `INSERT INTO payments
       (sender_username, receiver_username, sender_chain, settle_chain,
        input_amount, output_amount, receiver_address, tx_hash)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        req.user.username,
        receiver.username,
        senderChain,
        settleChain,
        amount,
        payout,
        receiver.preferred_address,
        txHash,
      ]
    )

    console.log("🟩 Payment saved successfully")

    res.json({ success: true, txHash, payout })
  } catch (err) {
    console.error("🟥 PAYMENT ERROR:", err)
    res.status(500).json({ error: "Payment failed" })
  }
})


module.exports = router;
