
"use client"
import Link from "next/link"
import { Coins, History, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { WalletButton } from "@/components/wallet-button"
import { useWallet } from "@/hooks/use-wallet"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { username, disconnect } = useWallet()
  const isAuthenticated = !!username

  const handleLogout = () => {
    disconnect()
    router.push("/")
  }

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Coins className="text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">ChainPay</span>
        </Link>

        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: "/send", label: "Send" },
              { href: "/receive", label: "Receive" },
              { href: "/history", label: "History", icon: History },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
                  pathname === href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {Icon && <Icon size={16} />}
                {label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <Button variant="ghost" onClick={() => router.push("/auth/login")}>
                Login
              </Button>
              <Button onClick={() => router.push("/auth/register")}>
                Register
              </Button>
              <ThemeToggle />
            </>
          )}

          {isAuthenticated && (
            <>
              <span className="text-sm font-medium">@{username}</span>
              <WalletButton />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={18} />
              </Button>
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
