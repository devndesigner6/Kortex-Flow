import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("GOOGLE_AI_API_KEY is not set in environment variables")
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export async function generateWithGemini(prompt: string): Promise<string> {
  const result = await geminiModel.generateContent(prompt)
  const response = result.response
  return response.text()
}
