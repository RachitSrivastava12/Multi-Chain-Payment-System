// // // ============================================
// // // hooks/use-wallet.ts
// // // ============================================
// // "use client"
// // import { create } from "zustand"

// // interface WalletState {
// //   token: string | null
// //   email: string | null
// //   username: string | null
// //   solAddress: string | null
// //   ethAddress: string | null
// //   login: (data: { token: string; email: string; username: string }) => void
// //   hydrate: () => Promise<void>
// //   disconnect: () => void
// //   setSolAddress: (address: string) => void
// //   setEthAddress: (address: string) => void
// // }

// // export const useWallet = create<WalletState>((set, get) => ({
// //   token: null,
// //   email: null,
// //   username: null,
// //   solAddress: null,
// //   ethAddress: null,

// //   login: ({ token, email, username }) => {
// //     localStorage.setItem("token", token)
// //     set({ token, email, username })
// //   },

// //   hydrate: async () => {
// //     if (typeof window === "undefined") return

// //     const token = localStorage.getItem("token")
    
// //     if (!token) {
// //       set({ token: null, email: null, username: null })
// //       return
// //     }

// //     try {
// //       const res = await fetch("http://localhost:4000/api/auth/me", {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       })

// //       if (!res.ok) {
// //         localStorage.removeItem("token")
// //         set({ token: null, email: null, username: null })
// //         return
// //       }

// //       const data = await res.json()
// //       set({ 
// //         token, 
// //         email: data.email, 
// //         username: data.username 
// //       })

// //       const solAddress = localStorage.getItem("solAddress")
// //       const ethAddress = localStorage.getItem("ethAddress")
// //       set({ solAddress, ethAddress })
      
// //     } catch (error) {
// //       console.error("Hydration failed:", error)
// //       localStorage.removeItem("token")
// //       set({ token: null, email: null, username: null })
// //     }
// //   },

// //   disconnect: () => {
// //     localStorage.removeItem("token")
// //     localStorage.removeItem("solAddress")
// //     localStorage.removeItem("ethAddress")
// //     set({
// //       token: null,
// //       email: null,
// //       username: null,
// //       solAddress: null,
// //       ethAddress: null,
// //     })
// //   },

// //   setSolAddress: (address: string) => {
// //     localStorage.setItem("solAddress", address)
// //     set({ solAddress: address })
// //   },

// //   setEthAddress: (address: string) => {
// //     localStorage.setItem("ethAddress", address)
// //     set({ ethAddress: address })
// //   },
// // }))
// // ============================================
// // hooks/use-wallet.ts - UPDATED WITH MANUAL WALLET
// // ============================================
// "use client"

// import { create } from "zustand"

// /* =====================================================
//    WINDOW TYPE EXTENSIONS (INLINE, NO EXTRA FILES)
//    ===================================================== */
// export {}

// declare global {
//   interface Window {
//     solana?: {
//       isPhantom?: boolean
//       connect: () => Promise<{
//         publicKey: {
//           toString(): string
//         }
//       }>
//     }

//     backpack?: {
//       isBackpack?: boolean
//       connect: () => Promise<{
//         publicKey: {
//           toString(): string
//         }
//       }>
//     }

//     ethereum?: {
//       isMetaMask?: boolean
//       isCoinbaseWallet?: boolean
//       request: (args: {
//         method: string
//         params?: any[]
//       }) => Promise<any>
//     }
//   }
// }
// /* ===================================================== */

// interface Wallet {
//   chain: "SOL" | "ETH"
//   address: string
//   provider: "phantom" | "backpack" | "metamask" | "coinbase" | "manual"
// }

// interface WalletState {
//   // Auth
//   token: string | null
//   email: string | null
//   username: string | null

//   // Wallets
//   connectedWallets: Wallet[]
//   activeWallet: Wallet | null

//   // Auth actions
//   login: (data: { token: string; email: string; username: string }) => void
//   hydrate: () => Promise<void>
//   disconnect: () => void

//   // Wallet actions
//   connectWallet: (provider: Wallet["provider"]) => Promise<void>
//   addManualWallet: (chain: "SOL" | "ETH", address: string) => Promise<void>
//   disconnectWallet: (address: string) => void
//   setActiveWallet: (wallet: Wallet) => void
//   fetchWallets: () => Promise<void>
//   saveWalletToBackend: (wallet: Wallet) => Promise<void>
// }

// const API = "http://localhost:4000/api"

// export const useWallet = create<WalletState>((set, get) => ({
//   token: null,
//   email: null,
//   username: null,
//   connectedWallets: [],
//   activeWallet: null,

//   /* ================= AUTH ================= */

//   login: ({ token, email, username }) => {
//     localStorage.setItem("token", token)
//     set({ token, email, username })
//   },

//   hydrate: async () => {
//     if (typeof window === "undefined") return

//     const token = localStorage.getItem("token")
//     if (!token) {
//       set({ token: null, email: null, username: null })
//       return
//     }

//     try {
//       const res = await fetch(`${API}/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (!res.ok) {
//         localStorage.removeItem("token")
//         set({ token: null, email: null, username: null })
//         return
//       }

//       const data = await res.json()
//       set({ token, email: data.email, username: data.username })
//       await get().fetchWallets()
//     } catch (err) {
//       console.error("Hydration failed:", err)
//       localStorage.removeItem("token")
//       set({ token: null, email: null, username: null })
//     }
//   },

//   disconnect: () => {
//     localStorage.removeItem("token")
//     set({
//       token: null,
//       email: null,
//       username: null,
//       connectedWallets: [],
//       activeWallet: null,
//     })
//   },

//   /* ================= BACKEND ================= */

//   fetchWallets: async () => {
//     const token = get().token
//     if (!token) return

//     try {
//       const res = await fetch(`${API}/wallets`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       if (res.ok) {
//         const wallets = await res.json()
//         const formatted: Wallet[] = wallets.map((w: any) => ({
//           chain: w.chain,
//           address: w.address,
//           provider: w.provider,
//         }))

//         set({ connectedWallets: formatted })

//         if (formatted.length && !get().activeWallet) {
//           set({ activeWallet: formatted[0] })
//         }
//       }
//     } catch (err) {
//       console.error("Failed to fetch wallets:", err)
//     }
//   },

//   saveWalletToBackend: async (wallet: Wallet) => {
//     const token = get().token
//     if (!token) return

//     try {
//       await fetch(`${API}/wallets`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(wallet),
//       })
//     } catch (err) {
//       console.error("Failed to save wallet:", err)
//     }
//   },

//   /* ================= MANUAL WALLET ================= */

//   addManualWallet: async (chain, address) => {
//     const trimmed = address.trim()

//     if (!trimmed || trimmed.length < 32) {
//       throw new Error("Invalid wallet address")
//     }

//     const exists = get().connectedWallets.find(
//       (w) => w.address.toLowerCase() === trimmed.toLowerCase()
//     )

//     if (exists) {
//       throw new Error("Wallet already added")
//     }

//     const wallet: Wallet = {
//       chain,
//       address: trimmed,
//       provider: "manual",
//     }

//     set({
//       connectedWallets: [...get().connectedWallets, wallet],
//       activeWallet: wallet,
//     })

//     await get().saveWalletToBackend(wallet)
//   },

//   /* ================= WALLET CONNECT ================= */

//   connectWallet: async (provider) => {
//     try {
//       let address = ""
//       let chain: "SOL" | "ETH" = "SOL"

//       if (provider === "phantom") {
//         if (!window.solana?.isPhantom) throw new Error("Phantom not installed")
//         const resp = await window.solana.connect()
//         address = resp.publicKey.toString()
//         chain = "SOL"
//       } else if (provider === "backpack") {
//         if (!window.backpack?.isBackpack) throw new Error("Backpack not installed")
//         const resp = await window.backpack.connect()
//         address = resp.publicKey.toString()
//         chain = "SOL"
//       } else if (provider === "metamask") {
//         if (!window.ethereum?.isMetaMask) throw new Error("MetaMask not installed")
//         const accounts = await window.ethereum.request({
//           method: "eth_requestAccounts",
//         })
//         address = accounts[0]
//         chain = "ETH"
//       } else if (provider === "coinbase") {
//         if (!window.ethereum?.isCoinbaseWallet)
//           throw new Error("Coinbase Wallet not installed")
//         const accounts = await window.ethereum.request({
//           method: "eth_requestAccounts",
//         })
//         address = accounts[0]
//         chain = "ETH"
//       } else {
//         throw new Error("Unsupported wallet provider")
//       }

//       const wallet: Wallet = { chain, address, provider }

//       const exists = get().connectedWallets.find(
//         (w) => w.address.toLowerCase() === address.toLowerCase()
//       )

//       if (!exists) {
//         set({
//           connectedWallets: [...get().connectedWallets, wallet],
//           activeWallet: wallet,
//         })
//         await get().saveWalletToBackend(wallet)
//       } else {
//         set({ activeWallet: exists })
//       }
//     } catch (err) {
//       console.error("Wallet connection failed:", err)
//       throw err
//     }
//   },

//   /* ================= DISCONNECT ================= */

//   disconnectWallet: (address) => {
//     const updated = get().connectedWallets.filter(
//       (w) => w.address !== address
//     )
//     set({ connectedWallets: updated })

//     if (get().activeWallet?.address === address) {
//       set({ activeWallet: updated[0] || null })
//     }
//   },

//   setActiveWallet: (wallet) => {
//     set({ activeWallet: wallet })
//   },
// }))

// ============================================
// hooks/use-wallet.ts - UPDATED WITH MANUAL WALLET
// ============================================
"use client"

import { create } from "zustand"

/* =====================================================
   WINDOW TYPE EXTENSIONS (INLINE)
   ===================================================== */
export {}

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean
      connect: () => Promise<{
        publicKey: {
          toString(): string
        }
      }>
    }

    backpack?: {
      isBackpack?: boolean
      connect: () => Promise<{
        publicKey: {
          toString(): string
        }
      }>
    }

    ethereum?: {
      isMetaMask?: boolean
      isCoinbaseWallet?: boolean
      request: (args: {
        method: string
        params?: any[]
      }) => Promise<any>
    }
  }
}
/* ===================================================== */

export type WalletProvider =
  | "phantom"
  | "backpack"
  | "metamask"
  | "coinbase"
  | "manual"

interface Wallet {
  chain: "SOL" | "ETH"
  address: string
  provider: WalletProvider
}

interface WalletState {
  // Auth
  token: string | null
  email: string | null
  username: string | null

  // Wallets
  connectedWallets: Wallet[]
  activeWallet: Wallet | null

  // Auth actions
  login: (data: { token: string; email: string; username: string }) => void
  hydrate: () => Promise<void>
  disconnect: () => void

  // Wallet actions
  connectWallet: (provider: WalletProvider) => Promise<void>
  addManualWallet: (chain: "SOL" | "ETH", address: string) => Promise<void>
  disconnectWallet: (address: string) => void
  setActiveWallet: (wallet: Wallet) => void
  fetchWallets: () => Promise<void>
  saveWalletToBackend: (wallet: Wallet) => Promise<void>
}

const API = "http://localhost:4000/api"

export const useWallet = create<WalletState>((set, get) => ({
  token: null,
  email: null,
  username: null,
  connectedWallets: [],
  activeWallet: null,

  /* ================= AUTH ================= */

  login: ({ token, email, username }) => {
    localStorage.setItem("token", token)
    set({ token, email, username })
  },

  hydrate: async () => {
    if (typeof window === "undefined") return

    const token = localStorage.getItem("token")
    if (!token) {
      set({ token: null, email: null, username: null })
      return
    }

    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        localStorage.removeItem("token")
        set({ token: null, email: null, username: null })
        return
      }

      const data = await res.json()
      set({ token, email: data.email, username: data.username })
      await get().fetchWallets()
    } catch (err) {
      console.error("Hydration failed:", err)
      localStorage.removeItem("token")
      set({ token: null, email: null, username: null })
    }
  },

  disconnect: () => {
    localStorage.removeItem("token")
    set({
      token: null,
      email: null,
      username: null,
      connectedWallets: [],
      activeWallet: null,
    })
  },

  /* ================= BACKEND ================= */

  fetchWallets: async () => {
    const token = get().token
    if (!token) return

    try {
      const res = await fetch(`${API}/wallets`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const wallets = await res.json()
        const formatted: Wallet[] = wallets.map((w: any) => ({
          chain: w.chain,
          address: w.address,
          provider: w.provider as WalletProvider,
        }))

        set({ connectedWallets: formatted })

        if (formatted.length && !get().activeWallet) {
          set({ activeWallet: formatted[0] })
        }
      }
    } catch (err) {
      console.error("Failed to fetch wallets:", err)
    }
  },

  saveWalletToBackend: async (wallet) => {
    const token = get().token
    if (!token) return

    try {
      await fetch(`${API}/wallets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wallet),
      })
    } catch (err) {
      console.error("Failed to save wallet:", err)
    }
  },

  /* ================= MANUAL WALLET ================= */

  addManualWallet: async (chain, address) => {
    const trimmed = address.trim()

    if (!trimmed || trimmed.length < 32) {
      throw new Error("Invalid wallet address")
    }

    const exists = get().connectedWallets.find(
      (w) => w.address.toLowerCase() === trimmed.toLowerCase()
    )

    if (exists) {
      throw new Error("Wallet already added")
    }

    const wallet: Wallet = {
      chain,
      address: trimmed,
      provider: "manual",
    }

    set({
      connectedWallets: [...get().connectedWallets, wallet],
      activeWallet: wallet,
    })

    await get().saveWalletToBackend(wallet)
  },

  /* ================= WALLET CONNECT ================= */

  connectWallet: async (provider) => {
    try {
      let address = ""
      let chain: "SOL" | "ETH" = "SOL"

      if (provider === "phantom") {
        if (!window.solana?.isPhantom) throw new Error("Phantom not installed")
        const resp = await window.solana.connect()
        address = resp.publicKey.toString()
        chain = "SOL"
      } else if (provider === "backpack") {
        if (!window.backpack?.isBackpack) throw new Error("Backpack not installed")
        const resp = await window.backpack.connect()
        address = resp.publicKey.toString()
        chain = "SOL"
      } else if (provider === "metamask") {
        if (!window.ethereum?.isMetaMask) throw new Error("MetaMask not installed")
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        address = accounts[0]
        chain = "ETH"
      } else if (provider === "coinbase") {
        if (!window.ethereum?.isCoinbaseWallet)
          throw new Error("Coinbase Wallet not installed")
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        })
        address = accounts[0]
        chain = "ETH"
      } else {
        throw new Error("Unsupported wallet provider")
      }

      const wallet: Wallet = { chain, address, provider }

      const exists = get().connectedWallets.find(
        (w) => w.address.toLowerCase() === address.toLowerCase()
      )

      if (!exists) {
        set({
          connectedWallets: [...get().connectedWallets, wallet],
          activeWallet: wallet,
        })
        await get().saveWalletToBackend(wallet)
      } else {
        set({ activeWallet: exists })
      }
    } catch (err) {
      console.error("Wallet connection failed:", err)
      throw err
    }
  },

  /* ================= DISCONNECT ================= */

  disconnectWallet: (address) => {
    const updated = get().connectedWallets.filter(
      (w) => w.address !== address
    )
    set({ connectedWallets: updated })

    if (get().activeWallet?.address === address) {
      set({ activeWallet: updated[0] || null })
    }
  },

  setActiveWallet: (wallet) => {
    set({ activeWallet: wallet })
  },
}))
