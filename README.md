# Multi-Chain Payment System (SOL ⇄ ETH) (ON DEVNET)

A cross-chain payment system that allows users to **send payments in one blockchain (SOL or ETH)** and **receive funds in their preferred chain**, with automatic conversion and settlement.

This project demonstrates backend-heavy blockchain infrastructure design, focusing on **payments, pricing, escrow execution, and transaction tracking**.

---

## 🚀 Features

- 🌉 **Cross-chain payments** between **Solana (SOL)** and **Ethereum (ETH)**
- 💱 **Automatic currency conversion** using live pricing feeds
- 🔐 **Escrow-based settlement** to ensure secure transfers
- 📜 **Transaction tracking & history**
- 👤 **User accounts with preferred settlement currency**
- 🧩 Modular backend architecture for easy extension

---

## 🏗️ Architecture Overview

### Backend
- **Node.js + Express**
- **PostgreSQL** for users, wallets, and payment records
- **JWT-based authentication**
- **Chain-specific services** for Solana & Ethereum
- **Pricing service** for real-time conversion rates

### Blockchain
- **Solana Web3.js** for SOL transfers
- **Ethereum (ethers.js)** for ETH transfers
- Escrow wallet model for controlled settlement

---


---

## 🔄 Payment Flow

1. Sender initiates a payment with:
   - Amount
   - Sender chain (SOL / ETH)
   - Receiver username
2. System:
   - Fetches receiver’s preferred currency
   - Converts amount if required
   - Executes transfer on destination chain
3. Transaction is recorded in the database with:
   - Sender & receiver
   - Input/output amounts
   - Settlement chain
   - Blockchain transaction hash

---

## 🧪 Example Use Case

- Sender pays **1 ETH**
- Receiver prefers **SOL**
- System converts ETH → SOL using live rates
- Funds are settled on Solana
- Transaction is logged and auditable

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Solana Web3.js**
- **ethers.js**
- **JWT Authentication**
- **REST APIs**
- **React.js**


---

## 📌 Notes

- Built as an **infrastructure-first project**, not a consumer wallet
- Designed to be extended into:
  - Payment rails
  - Cross-chain remittance systems
  - Protocol-level payment abstractions

---

## 👤 Author

**Rachit Srivastava**  
- GitHub: https://github.com/RachitSrivastava12  
- Focus: Blockchain infra, Solana, backend systems

---

⭐ If you find this useful, consider starring the repo.
