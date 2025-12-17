import { Header } from "@/components/header"
import { ReceivePayment } from "@/components/receive-payment"

export default function ReceivePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Receive Payment</h1>
            <p className="text-muted-foreground">Set your preferred currency and create a payment request</p>
          </div>
          <ReceivePayment />
        </div>
      </main>
    </div>
  )
}
