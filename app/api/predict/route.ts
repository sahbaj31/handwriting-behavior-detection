import { type NextRequest, NextResponse } from "next/server"
import { predictBehavior } from "@/lib/behavior-detector"

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const prediction = await predictBehavior(buffer)

    // Add timestamp
    const response = {
      ...prediction,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}
