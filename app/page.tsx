"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"
import ImageUploader from "@/components/image-uploader"
import PredictionHistory from "@/components/prediction-history"

export default function Home() {
  const [predictions, setPredictions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handlePredictionComplete = (newPrediction: any) => {
    setPredictions([newPrediction, ...predictions])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">HB</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Handwriting Behavior Detection</h1>
          </div>
          <p className="text-slate-400 text-lg">Analyze handwriting patterns to detect behavioral traits using AI</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Upload Handwriting Sample</h2>
              <ImageUploader onPredictionComplete={handlePredictionComplete} />

              {/* Description */}
              <div className="mt-8 p-6 bg-slate-700/30 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cyan-500" />
                  How it works
                </h3>
                <ul className="text-slate-300 space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-cyan-500 font-bold">1.</span>
                    <span>Upload a clear image of handwriting (JPG, PNG, GIF, WebP)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-500 font-bold">2.</span>
                    <span>Our AI analyzes slant angle, letter size, and stroke patterns</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-500 font-bold">3.</span>
                    <span>Get instant behavioral analysis from 5 classifications</span>
                  </li>
                </ul>
              </div>

              {/* Behavior Classes */}
              <div className="mt-8">
                <h3 className="font-semibold text-white mb-4">Detected Behaviors</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {["Calm", "Stressed", "Angry", "Focused", "Happy"].map((behavior) => (
                    <div key={behavior} className="p-3 bg-slate-700/40 rounded-lg border border-slate-600 text-center">
                      <p className="text-sm font-medium text-slate-300">{behavior}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <PredictionHistory predictions={predictions} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-400 text-sm">
          <p>Handwriting Behavior Detection System | Powered by AI Analysis</p>
        </div>
      </footer>
    </div>
  )
}
