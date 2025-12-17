// // "use client"

// // import { useState } from "react"
// // import { Input } from "@/components/ui/input"
// // import { Button } from "@/components/ui/button"
// // import { useRouter } from "next/navigation"
// // import { useToast } from "@/hooks/use-toast"

// // const API = "http://localhost:4000/api/auth/login"

// // export default function LoginPage() {
// //   const [email, setEmail] = useState("")
// //   const [password, setPassword] = useState("")
// //   const router = useRouter()
// //   const { toast } = useToast()

// //   const login = async () => {
// //     const res = await fetch(API, {
// //       method: "POST",
// //       credentials: "include", // ✅ REQUIRED
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ email, password }),
// //     })

// //     if (!res.ok) {
// //       toast({ title: "Login failed", variant: "destructive" })
// //       return
// //     }

// //     router.push("/")
// //   }

// //   return (
// //     <div className="max-w-md mx-auto mt-20 space-y-4">
// //       <h1 className="text-2xl font-bold">Login</h1>
// //       <Input placeholder="Email" onChange={e => setEmail(e.target.value)} />
// //       <Input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
// //       <Button className="w-full" onClick={login}>Login</Button>
// //     </div>
// //   )
// // }


// // ============================================
// // app/auth/login/page.tsx
// // ============================================
// "use client"
// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation"
// import { useToast } from "@/hooks/use-toast"
// import { useWallet } from "@/hooks/use-wallet"
// import Link from "next/link"

// const API = "http://localhost:4000/api/auth/login"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()
//   const login = useWallet((s) => s.login)

//   const handleLogin = async () => {
//     if (!email || !password) {
//       toast({ title: "Please fill in all fields", variant: "destructive" })
//       return
//     }

//     setLoading(true)
//     try {
//       const res = await fetch(API, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         toast({ title: data.error || "Login failed", variant: "destructive" })
//         return
//       }

//       login({
//         token: data.token,
//         email: data.email,
//         username: data.username,
//       })

//       toast({ title: "Login successful!" })
//       router.push("/")
//     } catch (error) {
//       toast({ title: "Network error", variant: "destructive" })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="max-w-md w-full space-y-6">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold">Welcome back</h1>
//           <p className="text-muted-foreground mt-2">Sign in to your account</p>
//         </div>

//         <div className="space-y-4">
//           <Input
//             placeholder="Email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleLogin()}
//           />
//           <Input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleLogin()}
//           />
//           <Button className="w-full" onClick={handleLogin} disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </Button>
//         </div>

//         <p className="text-center text-sm text-muted-foreground">
//           Don't have an account?{" "}
//           <Link href="/auth/register" className="text-primary hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   )
// }


// app/auth/login/page.tsx
// ============================================
"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import Link from "next/link"

const API = "http://localhost:4000/api/auth/login"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const login = useWallet((s) => s.login)

  const handleLogin = async () => {
    if (!email || !password) {
      toast({ title: "Please fill in all fields", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast({ title: data.error || "Login failed", variant: "destructive" })
        return
      }

      login({
        token: data.token,
        email: data.email,
        username: data.username,
      })

      toast({ title: "Login successful!" })
      router.push("/")
    } catch (error) {
      toast({ title: "Network error", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
