"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { CheckCircle, Download } from "lucide-react"

const BEHAVIORS = {
  Calm: { color: "#10b981", icon: "☘️" },
  Stressed: { color: "#f59e0b", icon: "⚡" },
  Angry: { color: "#ef4444", icon: "🔥" },
  Focused: { color: "#3b82f6", icon: "🎯" },
  Happy: { color: "#ec4899", icon: "😊" },
}

export default function PredictionResult({ result, onReset, preview }: any) {
  const scores = result.scores || {}
  const primaryBehavior = result.behavior || "Unknown"
  const confidence = result.confidence || 0

  // Prepare chart data
  const chartData = Object.entries(scores).map(([key, value]: [string, any]) => ({
    name: key,
    value: Number.parseFloat((value * 100).toFixed(1)),
    color: BEHAVIORS[key as keyof typeof BEHAVIORS]?.color || "#8b5cf6",
  }))

  const handleDownload = () => {
    const reportContent = `
Handwriting Behavior Detection Report
=====================================
Generated: ${new Date().toLocaleString()}

PRIMARY BEHAVIOR: ${primaryBehavior}
Confidence: ${(confidence * 100).toFixed(1)}%

DETAILED SCORES:
${Object.entries(scores)
  .map(([key, value]: [string, any]) => `${key}: ${(value * 100).toFixed(1)}%`)
  .join("\n")}

ANALYSIS:
${result.analysis || "Analysis details available"}

Key Indicators:
- Slant Angle: ${result.slant_angle?.toFixed(2) || "N/A"}°
- Letter Size: ${result.avg_size?.toFixed(2) || "N/A"}
- Stroke Thickness: ${result.stroke?.toFixed(2) || "N/A"}
    `.trim()

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `behavior-report-${Date.now()}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Detected Behavior</p>
            <h2 className="text-4xl font-bold text-white">{primaryBehavior}</h2>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-slate-300 font-medium">Confidence Score</p>
            <p className="text-2xl font-bold text-cyan-500">{(confidence * 100).toFixed(1)}%</p>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="mb-6">
            <img
              src={preview || "/placeholder.svg"}
              alt="Analyzed handwriting"
              className="max-h-64 w-full object-contain rounded-lg"
            />
          </div>
        )}

        {/* Analysis Details */}
        {result.analysis && (
          <div className="p-4 bg-slate-600/30 rounded-lg border border-slate-600">
            <p className="text-slate-200 text-sm">{result.analysis}</p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6">Behavior Scores</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs font-semibold mb-1">SLANT ANGLE</p>
          <p className="text-2xl font-bold text-cyan-500">{result.slant_angle?.toFixed(1) || "N/A"}°</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs font-semibold mb-1">LETTER SIZE</p>
          <p className="text-2xl font-bold text-cyan-500">{result.avg_size?.toFixed(1) || "N/A"}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs font-semibold mb-1">STROKE WIDTH</p>
          <p className="text-2xl font-bold text-cyan-500">{result.stroke?.toFixed(2) || "N/A"}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Report
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all"
        >
          Analyze Another
        </button>
      </div>
    </div>
  )
}
