import { NextRequest, NextResponse } from "next/server"
import algosdk from "algosdk"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const address = searchParams.get("address")
    const network = searchParams.get("network") || "testnet"

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    console.log("[v0 API] Fetching balance for:", address, "on", network)

    const nodeServer = network === "mainnet" 
      ? "https://mainnet-api.algonode.cloud" 
      : "https://testnet-api.algonode.cloud"

    const algodClient = new algosdk.Algodv2("", nodeServer, "")
    
    console.log("[v0 API] Using node:", nodeServer)
    
    const accountInfo = await algodClient.accountInformation(address).do()
    console.log("[v0 API] Account info received:", accountInfo)

    const balance = accountInfo.amount / 1_000_000 // Convert microAlgos to ALGO
    console.log("[v0 API] Balance:", balance, "ALGO")

    return NextResponse.json({ balance, address, network })
  } catch (error) {
    console.error("[v0 API] Error fetching balance:", error)
    return NextResponse.json(
      { error: "Failed to fetch balance", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
