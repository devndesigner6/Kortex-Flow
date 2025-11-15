// Mock payment system for development and testing
// Set MOCK_PAYMENTS to true to simulate successful transactions

export const MOCK_PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_MOCK_PAYMENTS === "true" || true // Default to mock for now

export interface MockPaymentResult {
  success: boolean
  txId?: string
  error?: string
}

export async function simulatePayment(
  from: string,
  to: string,
  amount: number,
  note?: string
): Promise<MockPaymentResult> {
  console.log("[v0 MOCK PAYMENT] Simulating payment...")
  console.log("[v0 MOCK PAYMENT] From:", from)
  console.log("[v0 MOCK PAYMENT] To:", to)
  console.log("[v0 MOCK PAYMENT] Amount:", amount, "ALGO")
  console.log("[v0 MOCK PAYMENT] Note:", note)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generate a fake transaction ID
  const mockTxId = `MOCK_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`

  console.log("[v0 MOCK PAYMENT] Payment successful!")
  console.log("[v0 MOCK PAYMENT] Transaction ID:", mockTxId)

  return {
    success: true,
    txId: mockTxId,
  }
}

export function getMockBalance(): number {
  // Return a mock balance of 14.892 ALGO (in microAlgos)
  return 14.892
}
