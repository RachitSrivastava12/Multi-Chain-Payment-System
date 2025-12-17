
// ============================================
// backend/routes/auth.js
// ============================================
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const auth = require("../middleware/auth");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "BKHHOBLNNBVB";

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, username)
       VALUES ($1, $2, $3)
       RETURNING id, email, username`,
      [email, hash, username]
    );

    // const token = jwt.sign(
    //   { userId: result.rows[0].id },
    //   JWT_SECRET,
    //   { expiresIn: "7d" }
    // );

    // res.json({
    //   token,
    //   email: result.rows[0].email,
    //   username: result.rows[0].username,
    // });

    const token = jwt.sign(
  {
    userId: result.rows[0].id,
    username: result.rows[0].username,
  },
  JWT_SECRET,
  { expiresIn: "7d" }
);

res.json({
  token,
  email: result.rows[0].email,
  username: result.rows[0].username,
});





  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email or username already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

   const token = jwt.sign(
  {
    userId: user.id,
    username: user.username,
  },
  JWT_SECRET,
  { expiresIn: "7d" }
);

    res.json({
      token,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT email, username FROM users WHERE id=$1",
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});


router.post("/users/preferences", auth, async (req, res) => {
  const { preferredChain, preferredAddress } = req.body;

  if (!preferredChain || !preferredAddress) {
    return res.status(400).json({ error: "Missing preferences" });
  }

  if (!["SOL", "ETH"].includes(preferredChain)) {
    return res.status(400).json({ error: "Invalid chain" });
  }

  try {
    await pool.query(
      `
      UPDATE users
      SET preferred_chain = $1,
          preferred_address = $2
      WHERE id = $3
      `,
      [preferredChain, preferredAddress, req.userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Failed to save preferences:", err);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

module.exports = router;
