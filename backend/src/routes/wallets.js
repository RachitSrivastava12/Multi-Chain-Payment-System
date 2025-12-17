// const express = require("express");
// const pool = require("../db");
// const auth = require("../middleware/auth");

// const router = express.Router();

// /** Add wallet */
// router.post("/", auth, async (req, res) => {
//   const { chain, address } = req.body;

//   const result = await pool.query(
//     `INSERT INTO wallets (user_id, chain, address)
//      VALUES ($1,$2,$3) RETURNING *`,
//     [req.user.userId, chain, address]
//   );

//   res.json(result.rows[0]);
// });

// /** Get my wallets */
// router.get("/me", auth, async (req, res) => {
//   const result = await pool.query(
//     "SELECT chain,address FROM wallets WHERE user_id=$1",
//     [req.user.userId]
//   );
//   res.json(result.rows);
// });

// module.exports = router;


const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { chain, address } = req.body;

  if (!["SOL", "ETH"].includes(chain)) {
    return res.status(400).json({ error: "Invalid chain" });
  }

  try {
    await pool.query(
      `INSERT INTO wallets (user_id, chain, address)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, chain)
       DO UPDATE SET address = $3`,
      [req.userId, chain, address]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save wallet" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT chain, address FROM wallets WHERE user_id=$1",
      [req.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch wallets" });
  }
});

module.exports = router;
