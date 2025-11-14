import { NextRequest, NextResponse } from "next/server"
import algosdk from "algosdk"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const address = searchParams.get("address")
    const network = searchParams.get("network") || "testnet"

    console.log("[v0 API] ===== BALANCE REQUEST =====")
    console.log("[v0 API] Address:", address)
    console.log("[v0 API] Network:", network)

    if (!address) {
      console.error("[v0 API] No address provided")
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    const nodeServer = network === "mainnet" 
      ? "https://mainnet-api.algonode.cloud" 
      : "https://testnet-api.algonode.cloud"

    console.log("[v0 API] Node server:", nodeServer)

    const algodClient = new algosdk.Algodv2("", nodeServer, "")
    
    console.log("[v0 API] Fetching account information...")
    const accountInfo = await algodClient.accountInformation(address).do()
    console.log("[v0 API] Account info received:", JSON.stringify(accountInfo, null, 2))

    const balance = accountInfo.amount / 1_000_000
    console.log("[v0 API] Calculated balance:", balance, "ALGO")
    console.log("[v0 API] ===== BALANCE REQUEST COMPLETE =====")

    return NextResponse.json({ balance, address, network })
  } catch (error) {
    console.error("[v0 API] ===== ERROR =====")
    console.error("[v0 API] Error type:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("[v0 API] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[v0 API] Full error:", error)
    
    return NextResponse.json(
      { 
        error: "Failed to fetch balance", 
        details: error instanceof Error ? error.message : String(error),
        type: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    )
  }
}
