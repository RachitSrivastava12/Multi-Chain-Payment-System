// import type React from "react"
// import type { Metadata } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
// import { Toaster } from "@/components/ui/toaster"
// import "./globals.css"

// const _geist = Geist({ subsets: ["latin"] })
// const _geistMono = Geist_Mono({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "ChainPay - Cross-Chain Crypto Payments",
//   description: "Send in SOL or ETH, receive in your preferred currency",
//   generator: "v0.app",
//   icons: {
//     icon: [
//       {
//         url: "/icon-light-32x32.png",
//         media: "(prefers-color-scheme: light)",
//       },
//       {
//         url: "/icon-dark-32x32.png",
//         media: "(prefers-color-scheme: dark)",
//       },
//       {
//         url: "/icon.svg",
//         type: "image/svg+xml",
//       },
//     ],
//     apple: "/apple-icon.png",
//   },
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className={`font-sans antialiased`}>
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               try {
//                 const theme = localStorage.getItem('theme');
//                 if (theme === 'dark') {
//                   document.documentElement.classList.add('dark');
//                 }
//               } catch (e) {}
//             `,
//           }}
//         />
//         {children}
//         <Toaster />
//         <Analytics />
//       </body>
//     </html>
//   )
// }



// import type React from "react"
// import type { Metadata } from "next"
// import { Geist, Geist_Mono } from "next/font/google"
// import { Analytics } from "@vercel/analytics/next"
// import { Toaster } from "@/components/ui/toaster"
// import { AuthHydrator } from "@/components/auth-hydrator"
// import "./globals.css"

// const _geist = Geist({ subsets: ["latin"] })
// const _geistMono = Geist_Mono({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "ChainPay - Cross-Chain Crypto Payments",
//   description: "Send in SOL or ETH, receive in your preferred currency",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className="font-sans antialiased">
//         {/* 🔥 AUTH STATE HYDRATION (SAFE) */}
//         <AuthHydrator />

//         {/* theme bootstrap */}
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               try {
//                 const theme = localStorage.getItem('theme');
//                 if (theme === 'dark') {
//                   document.documentElement.classList.add('dark');
//                 }
//               } catch (e) {}
//             `,
//           }}
//         />

//         {children}
//         <Toaster />
//         <Analytics />
//       </body>
//     </html>
//   )
// }



// app/layout.tsx
// ============================================
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthHydrator } from "@/components/auth-hydrator"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChainPay - Cross-Chain Payments Made Simple",
  description: "Send in SOL or ETH, receive in your preferred currency",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthHydrator />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
