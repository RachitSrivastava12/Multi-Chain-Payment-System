CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,

  username TEXT UNIQUE NOT NULL,

  sol_address TEXT UNIQUE,
  eth_address TEXT UNIQUE,

  preferred_currency TEXT
    CHECK (preferred_currency IN ('sol','eth'))
    DEFAULT 'sol',

  created_at TIMESTAMP DEFAULT NOW()
);
