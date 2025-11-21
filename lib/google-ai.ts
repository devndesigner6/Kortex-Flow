import { GoogleGenerativeAI } from "@google/generative-ai"

let genAI: GoogleGenerativeAI | null = null
let geminiModel: any = null

function initializeGemini() {
  if (!genAI && process.env.GOOGLE_AI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  }
  return geminiModel
}

export async function generateWithGemini(prompt: string): Promise<string> {
  const model = initializeGemini()
  
  if (!model) {
    throw new Error("GOOGLE_AI_API_KEY is not set in environment variables")
  }
  
  const result = await model.generateContent(prompt)
  const response = result.response
  return response.text()
}

export { geminiModel }
