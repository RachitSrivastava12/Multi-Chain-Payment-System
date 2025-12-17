
"use client"
import { useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"

export function AuthHydrator() {
  const hydrate = useWallet((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return null
}
