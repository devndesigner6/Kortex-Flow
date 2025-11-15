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
    
    const microAlgos = Number(accountInfo.amount)
    const balance = microAlgos / 1_000_000
    
    console.log("[v0 API] Raw amount:", accountInfo.amount)
    console.log("[v0 API] Micro ALGOs (number):", microAlgos)
    console.log("[v0 API] Balance in ALGO:", balance)
    console.log("[v0 API] ===== BALANCE REQUEST COMPLETE =====")

    // Return balance in ALGO (not microAlgos)
    return NextResponse.json({ 
      balance, 
      microAlgos, 
      address, 
      network 
    })
  } catch (error) {
    console.error("[v0 API] ===== ERROR =====")
    console.error("[v0 API] Error type:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("[v0 API] Error message:", error instanceof Error ? error.message : String(error))
    
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
