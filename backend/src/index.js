

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const walletRoutes = require("./routes/wallets");
const paymentRoutes = require("./routes/payments");
const cookieParser = require("cookie-parser");

const { PORT } = require("./config");
const auth = require("./middleware/auth");

const pool = require('./db')


const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (_, res) => {
  res.send("✅ ChainPay Backend Running");
});


// app.post("/api/users/preferences", auth, async (req, res) => {
//   const { preferredChain, preferredAddress } = req.body;
//   const userId = req.userId; // set by authMiddleware

//   if (!preferredChain || !preferredAddress) {
//     return res.status(400).json({ error: "Missing preferences" });
//   }

//   if (!["SOL", "ETH"].includes(preferredChain)) {
//     return res.status(400).json({ error: "Invalid chain" });
//   }

//   try {
//     const result = await pool.query(
//       `
//       UPDATE users
//       SET preferred_chain = $1,
//           preferred_address = $2
//       WHERE id = $3
//       RETURNING id, preferred_chain, preferred_address
//       `,
//       [preferredChain, preferredAddress, userId]
//     );

//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json({ success: true, data: result.rows[0] });
//   } catch (err) {
//     console.error("Failed to save preferences:", err);
//     res.status(500).json({ error: "Failed to save preferences" });
//   }
// });


app.post("/api/users/preferences", auth, async (req, res) => {
  console.log("📥 BODY:", req.body);
  console.log("👤 USER ID:", req.userId);

  const { preferredChain, preferredAddress } = req.body;

  if (!preferredChain || !preferredAddress) {
    console.log("❌ Missing fields");
    return res.status(400).json({ error: "Missing preferences" });
  }

  if (!["SOL", "ETH"].includes(preferredChain)) {
    console.log("❌ Invalid chain:", preferredChain);
    return res.status(400).json({ error: "Invalid chain" });
  }

  try {
    console.log("🛠 Updating DB...");

    const result = await pool.query(
      `
      UPDATE users
      SET preferred_chain = $1,
          preferred_address = $2
      WHERE id = $3
      RETURNING id, preferred_chain, preferred_address
      `,
      [preferredChain, preferredAddress, req.userId]
    );

    console.log("📊 ROW COUNT:", result.rowCount);
    console.log("📄 RESULT:", result.rows);

    if (result.rowCount === 0) {
      console.log("❌ No user found for ID:", req.userId);
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("🔥 DB ERROR:", err);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running on ${PORT}`)
);

