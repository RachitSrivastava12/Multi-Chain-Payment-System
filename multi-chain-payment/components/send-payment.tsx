


"use client"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const API = "https://multi-chain-payment-system-1.onrender.com/api/payments/send"

export function SendPayment() {
  const { activeWallet, token } = useWallet()
  const [receiverUsername, setReceiverUsername] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  console.log("🟦 SendPayment render", { activeWallet, token })

  if (!activeWallet) {
    console.log("🟦 No active wallet connected")
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Connect a wallet to send payments
          </p>
        </CardContent>
      </Card>
    )
  }

  const send = async () => {
    console.log("🟦 SEND CLICKED")

    if (!receiverUsername || !amount) {
      console.warn("🟦 Missing fields", { receiverUsername, amount })
      toast({ title: "Missing fields", variant: "destructive" })
      return
    }

    const payload = {
      receiverUsername: receiverUsername.replace(/^@/, ""),
      senderChain: activeWallet.chain.toLowerCase(),
      amount: Number(amount),
    }

    console.log("🟦 Payload being sent →", payload)
    console.log("🟦 JWT token →", token)

    setLoading(true)

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      console.log("🟦 HTTP status:", res.status)

      const data = await res.json()
      console.log("🟦 Response body:", data)

      if (!res.ok) throw new Error(data.error)

      toast({
        title: "Payment sent successfully!",
        description: `TX: ${data.txHash?.slice(0, 10)}...`,
      })

      setReceiverUsername("")
      setAmount("")
    } catch (e: any) {
      console.error("🟥 Frontend error:", e)
      toast({
        title: "Payment failed",
        description: e.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Payment</CardTitle>
        <CardDescription>
          Pay anyone using their ChainPay username
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Paying from</p>
          <p className="font-mono text-sm">
            {activeWallet.address.slice(0, 8)}...{activeWallet.address.slice(-6)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {activeWallet.chain} • {activeWallet.provider}
          </p>
        </div>

        <div>
          <Label>Receiver Username</Label>
          <Input
            value={receiverUsername}
            onChange={(e) => {
              console.log("🟦 Receiver username changed:", e.target.value)
              setReceiverUsername(e.target.value)
            }}
            placeholder="@username"
          />
        </div>

        <div>
          <Label>Amount ({activeWallet.chain})</Label>
          <Input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => {
              console.log("🟦 Amount changed:", e.target.value)
              setAmount(e.target.value)
            }}
            placeholder="0.00"
          />
        </div>

        <Button onClick={send} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Payment"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
