CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  sender_username TEXT NOT NULL,
  receiver_username TEXT NOT NULL,

  sender_chain TEXT CHECK (sender_chain IN ('sol','eth')),
  settle_chain TEXT CHECK (settle_chain IN ('sol','eth')),

  input_amount NUMERIC NOT NULL,
  output_amount NUMERIC NOT NULL,

  receiver_address TEXT NOT NULL,
  tx_hash TEXT NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);
