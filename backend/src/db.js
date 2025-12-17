const { Pool } = require("pg");
const { DATABASE_URL } = require("./config");

const pool = new Pool({
  connectionString: "postgresql://chain_to_chain_user:F0DLiFQ6IkVQPRMu82Pww4eDtk50kwdQ@dpg-d4voednpm1nc73bslgfg-a.oregon-postgres.render.com/chain_to_chain",
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
