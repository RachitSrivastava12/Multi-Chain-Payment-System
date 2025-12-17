// ============================================
// components/wallet-button.tsx - UPDATED WITH MANUAL ENTRY
// ============================================
"use client"
import { type WalletProvider } from "@/hooks/use-wallet"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Check, Plus, X, Edit } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function WalletButton() {
  const {
    connectedWallets,
    activeWallet,
    connectWallet,
    addManualWallet,
    disconnectWallet,
    setActiveWallet,
  } = useWallet()

  const [mounted, setMounted] = useState(false)
  const [showManualDialog, setShowManualDialog] = useState(false)
  const [manualChain, setManualChain] = useState<"SOL" | "ETH">("SOL")
  const [manualAddress, setManualAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Detect available wallets
  // const hasMetaMask = typeof window !== "undefined" && window.ethereum?.isMetaMask
  // const hasCoinbase = typeof window !== "undefined" && window.ethereum?.isCoinbaseWallet
  // const hasPhantom = typeof window !== "undefined" && window.solana?.isPhantom
  // const hasBackpack = typeof window !== "undefined" && window.backpack?.isBackpack

const hasMetaMask = typeof window !== "undefined" && !!window.ethereum?.isMetaMask
const hasCoinbase = typeof window !== "undefined" && !!window.ethereum?.isCoinbaseWallet
const hasPhantom = typeof window !== "undefined" && !!window.solana?.isPhantom
const hasBackpack = typeof window !== "undefined" && !!window.backpack?.isBackpack

  // const availableWallets = [
  //   { id: "phantom" as const, name: "Phantom (SOL)", available: hasPhantom },
  //   { id: "backpack" as const, name: "Backpack (SOL)", available: hasBackpack },
  //   { id: "metamask" as const, name: "MetaMask (ETH)", available: hasMetaMask },
  //   { id: "coinbase" as const, name: "Coinbase Wallet (ETH)", available: hasCoinbase },
  // ].filter((w) => w.available)

  

  const availableWallets: { id: WalletProvider; name: string; available: boolean }[] = [
  { id: "phantom", name: "Phantom (SOL)", available: hasPhantom },
  { id: "backpack", name: "Backpack (SOL)", available: hasBackpack },
  { id: "metamask", name: "MetaMask (ETH)", available: hasMetaMask },
  { id: "coinbase", name: "Coinbase Wallet (ETH)", available: hasCoinbase },
].filter(
  (w): w is { id: WalletProvider; name: string; available: true } => w.available
)


 const handleConnect = async (provider: WalletProvider) => {
    try {
      await connectWallet(provider)
      toast({ title: "Wallet connected!" })
    } catch (error: any) {
      toast({ title: "Failed to connect", description: error.message, variant: "destructive" })
    }
  }

  const handleManualAdd = async () => {
    if (!manualAddress.trim()) {
      toast({ title: "Please enter a wallet address", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      await addManualWallet(manualChain, manualAddress)
      toast({ title: "Wallet added successfully!" })
      setShowManualDialog(false)
      setManualAddress("")
    } catch (error: any) {
      toast({ title: "Failed to add wallet", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = (address: string) => {
    disconnectWallet(address)
    toast({ title: "Wallet disconnected" })
  }

  // No wallets connected
  if (connectedWallets.length === 0) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {availableWallets.length === 0 && (
              <DropdownMenuItem disabled>No wallets detected</DropdownMenuItem>
            )}
            {availableWallets.map((wallet) => (
              <DropdownMenuItem
                key={wallet.id}
                onClick={() => handleConnect(wallet.id)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {wallet.name}
              </DropdownMenuItem>
            ))}
            {availableWallets.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={() => setShowManualDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Add Manually
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Wallet Manually</DialogTitle>
              <DialogDescription>
                Paste your wallet address to add it to your account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Chain</Label>
                <Select
                  value={manualChain}
                  onValueChange={(v) => setManualChain(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOL">Solana (SOL)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Wallet Address</Label>
                <Input
                  placeholder={
                    manualChain === "SOL"
                      ? "Enter Solana address..."
                      : "0x... Enter Ethereum address"
                  }
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                />
              </div>
              <Button
                onClick={handleManualAdd}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Adding..." : "Add Wallet"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Wallets connected
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Wallet className="mr-2 h-4 w-4" />
            {activeWallet?.address.slice(0, 6)}...{activeWallet?.address.slice(-4)}
            <span className="ml-2 text-xs text-muted-foreground">
              ({activeWallet?.chain})
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Connected Wallets</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {connectedWallets.map((wallet) => (
            <DropdownMenuItem
              key={wallet.address}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setActiveWallet(wallet)}
            >
              <div className="flex items-center gap-2">
                {activeWallet?.address === wallet.address && (
                  <Check className="h-4 w-4 text-primary" />
                )}
                <div>
                  <div className="text-sm font-medium">
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {wallet.chain} • {wallet.provider}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDisconnect(wallet.address)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Add Wallet</DropdownMenuLabel>
          {availableWallets.map((wallet) => (
            <DropdownMenuItem
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
            >
              <Plus className="mr-2 h-4 w-4" />
              {wallet.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={() => setShowManualDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Add Manually
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Wallet Manually</DialogTitle>
            <DialogDescription>
              Paste your wallet address to add it to your account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Chain</Label>
              <Select
                value={manualChain}
                onValueChange={(v) => setManualChain(v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL">Solana (SOL)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Wallet Address</Label>
              <Input
                placeholder={
                  manualChain === "SOL"
                    ? "Enter Solana address..."
                    : "0x... Enter Ethereum address"
                }
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Make sure you control this wallet address
              </p>
            </div>
            <Button
              onClick={handleManualAdd}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Adding..." : "Add Wallet"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}