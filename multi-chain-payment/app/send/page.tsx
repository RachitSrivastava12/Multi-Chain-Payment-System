import { Header } from "@/components/header"
import { SendPayment } from "@/components/send-payment"

export default function SendPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Send Payment</h1>
            <p className="text-muted-foreground">Send crypto in SOL or ETH to any address</p>
          </div>
          <SendPayment />
        </div>
      </main>
    </div>
  )
}
