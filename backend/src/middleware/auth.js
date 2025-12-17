
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "BKHHOBLNNBVB";

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ EXPECT token payload to contain these
    const userId = decoded.id || decoded.userId;
    const username = decoded.username;

    if (!userId || !username) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // 🔥 STANDARD SHAPE
    req.user = {
      id: userId,
      username,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

