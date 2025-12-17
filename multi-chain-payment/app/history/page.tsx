"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const API = "http://localhost:4000/api/payments/history"

export default function HistoryPage() {
  const { username } = useWallet()
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    fetch(`${API}/${username}`)
      .then(res => res.json())
      .then(setItems)
  }, [username])

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 && (
            <p className="text-muted-foreground">No payments yet</p>
          )}

          {items.map(p => (
            <div
              key={p.id}
              className="border rounded-lg p-3 text-sm"
            >
              <div className="flex justify-between">
                <span>{p.sender_username} → {p.receiver_username}</span>
                <span>{new Date(p.created_at).toLocaleString()}</span>
              </div>
              <div className="text-muted-foreground">
                {p.input_amount} {p.sender_chain.toUpperCase()} → {p.output_amount} {p.settle_chain.toUpperCase()}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
