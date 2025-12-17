

// ============================================
// components/receive-payment.tsx - UPDATED
// ============================================
"use client"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"
import { Copy, Check } from "lucide-react"

const API = "http://localhost:4000/api"

export function ReceivePayment() {
  const { connectedWallets, username, token } = useWallet()
  const [preferredChain, setPreferredChain] = useState<"SOL" | "ETH">("SOL")
  const [preferredAddress, setPreferredAddress] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const solWallets = connectedWallets.filter((w) => w.chain === "SOL")
  const ethWallets = connectedWallets.filter((w) => w.chain === "ETH")

  useEffect(() => {
    // Auto-select first wallet of preferred chain
    if (preferredChain === "SOL" && solWallets.length > 0) {
      setPreferredAddress(solWallets[0].address)
    } else if (preferredChain === "ETH" && ethWallets.length > 0) {
      setPreferredAddress(ethWallets[0].address)
    }
  }, [preferredChain, connectedWallets])

  if (connectedWallets.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Connect a wallet to receive payments
          </p>
        </CardContent>
      </Card>
    )
  }

  // const save = async () => {
  //   if (!preferredAddress) {
  //     toast({ title: "Please select a wallet", variant: "destructive" })
  //     return
  //   }

  //   try {
  //     const res = await fetch(`${API}/users/preferences`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         preferredChain,
  //         preferredAddress,
  //       }),
  //     })

  //     if (!res.ok) throw new Error("Failed to save")

  //     toast({ title: "Preferences saved successfully!" })
  //   } catch (error) {
  //     toast({
  //       title: "Failed to save preferences",
  //       variant: "destructive",
  //     })
  //   }
  // }

  const save = async () => {
  console.log("➡️ Saving preferences:", {
    preferredChain,
    preferredAddress,
    token,
  });

  try {
    const res = await fetch(`${API}/users/preferences`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        preferredChain,
        preferredAddress,
      }),
    });

    console.log("⬅️ Response status:", res.status);

    const data = await res.json();
    console.log("⬅️ Response body:", data);

    if (!res.ok) throw new Error(data.error || "Failed");

    toast({ title: "Preferences saved successfully!" });
  } catch (error) {
    console.error("❌ SAVE ERROR:", error);
    toast({
      title: "Failed to save preferences",
      variant: "destructive",
    });
  }
};


  const copyUsername = () => {
    navigator.clipboard.writeText(`@${username}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: "Username copied!" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receive Payments</CardTitle>
        <CardDescription>
          Set your preferred currency and wallet address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Your payment username
          </p>
          <div className="flex items-center gap-2">
            <code className="text-lg font-bold">@{username}</code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyUsername}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div>
          <Label>Preferred Currency</Label>
          <Select
            value={preferredChain}
            onValueChange={(v) => setPreferredChain(v as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SOL" disabled={solWallets.length === 0}>
                Solana (SOL) {solWallets.length === 0 && "- No wallet"}
              </SelectItem>
              <SelectItem value="ETH" disabled={ethWallets.length === 0}>
                Ethereum (ETH) {ethWallets.length === 0 && "- No wallet"}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Receive at Wallet</Label>
          <Select
            value={preferredAddress}
            onValueChange={setPreferredAddress}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select wallet" />
            </SelectTrigger>
            <SelectContent>
              {(preferredChain === "SOL" ? solWallets : ethWallets).map(
                (wallet) => (
                  <SelectItem key={wallet.address} value={wallet.address}>
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)} (
                    {wallet.provider})
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        {preferredAddress && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">
              Payments will be sent to:
            </p>
            <p className="font-mono text-sm break-all">{preferredAddress}</p>
          </div>
        )}

        <Button onClick={save} className="w-full">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  )
}
