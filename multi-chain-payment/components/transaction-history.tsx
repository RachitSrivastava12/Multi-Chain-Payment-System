"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

const mockTransactions = [
  {
    id: "1",
    type: "sent",
    from: "eth",
    to: "sol",
    amount: "0.5",
    received: "7.75",
    recipient: "0x742d35Cc...5f0bEb",
    timestamp: "2 hours ago",
    status: "completed",
  },
  {
    id: "2",
    type: "received",
    from: "sol",
    to: "eth",
    amount: "10",
    received: "0.65",
    sender: "DYw8jCTf...G5CNSKK",
    timestamp: "5 hours ago",
    status: "completed",
  },
  {
    id: "3",
    type: "sent",
    from: "eth",
    to: "eth",
    amount: "1.2",
    received: "1.2",
    recipient: "0x8f3Cf7...a30e97",
    timestamp: "1 day ago",
    status: "completed",
  },
]

export function TransactionHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent cross-chain payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === "sent" ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"
                }`}
              >
                {tx.type === "sent" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium">{tx.type === "sent" ? "Sent" : "Received"}</p>
                  <Badge variant={tx.from === tx.to ? "secondary" : "default"}>
                    {tx.from.toUpperCase()} → {tx.to.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {tx.type === "sent" ? `To ${tx.recipient}` : `From ${tx.sender}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{tx.timestamp}</p>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.type === "sent" ? "text-destructive" : "text-secondary"}`}>
                  {tx.type === "sent" ? "-" : "+"}
                  {tx.received} {tx.to.toUpperCase()}
                </p>
                {tx.from !== tx.to && (
                  <p className="text-xs text-muted-foreground">
                    from {tx.amount} {tx.from.toUpperCase()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
