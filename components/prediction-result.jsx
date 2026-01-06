"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { CheckCircle, Download, Lightbulb, Film, TrendingUp } from "lucide-react"
import { useState } from "react"
import MoodSuggestions from "./mood-suggestions"
import MovieRecommendations from "./movie-recommendations"

const BEHAVIORS = {
  Calm: { color: "#10b981", icon: "☘️" },
  Stressed: { color: "#f59e0b", icon: "⚡" },
  Angry: { color: "#ef4444", icon: "🔥" },
  Focused: { color: "#3b82f6", icon: "🎯" },
  Happy: { color: "#ec4899", icon: "😊" },
}

export default function PredictionResult({ result, onReset, preview }) {
  const [showMoodSuggestions, setShowMoodSuggestions] = useState(false)
  const [showMovies, setShowMovies] = useState(false)

  const scores = result.scores || {}
  const primaryBehavior = result.behavior || "Unknown"
  const confidence = (result.confidence || 0) / 100 // Convert from percentage if already multiplied

  const modelAccuracy = result.modelAccuracy || 0
  const overallAccuracy = result.overallAccuracy || 0
  const featureConsistency = result.featureConsistency || 0
  const entropy = result.entropy || "0"
  const precision = result.precision || {}
  const featureMetrics = result.featureMetrics || {}

  // Prepare chart data
  const chartData = Object.entries(scores).map(([key, value]) => ({
    name: key,
    value: Number.parseFloat((value * 100).toFixed(1)),
    color: BEHAVIORS[key]?.color || "#8b5cf6",
  }))

  const handleDownload = () => {
    const timestamp = new Date().toLocaleString()
    const reportContent = `
╔════════════════════════════════════════════════════════════════╗
║        HANDWRITING BEHAVIOR DETECTION ANALYSIS REPORT          ║
╚════════════════════════════════════════════════════════════════╝

Generated: ${timestamp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRIMARY BEHAVIOR DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Behavior: ${primaryBehavior}
Confidence Level: ${(confidence * 100).toFixed(2)}%
Description: ${result.analysis || "Analysis details available"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ANALYSIS METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Prediction Entropy:         ${entropy}
Processing Time:            ${result.processingTime || "< 100ms"}
Total Features Analyzed:    ${result.totalFeaturesAnalyzed || 3}
Classification Confidence:  ${(confidence * 100).toFixed(2)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEHAVIOR DISTRIBUTION SCORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${Object.entries(scores)
  .sort((a, b) => b[1] - a[1])
  .map(([key, value]) => `${key.padEnd(15)} ${(value * 100).toFixed(2)}%`)
  .join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HANDWRITING FEATURES DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Slant Angle:                ${result.slant_angle?.toFixed(2) || "N/A"}°
Letter Size:                ${result.avg_size?.toFixed(2) || "N/A"}
Stroke Thickness:           ${result.stroke?.toFixed(3) || "N/A"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEHAVIOR INTERPRETATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${
  confidence >= 0.8
    ? "✓ HIGH CONFIDENCE: The prediction is reliable with strong handwriting indicators."
    : confidence >= 0.6
      ? "~ MODERATE CONFIDENCE: The prediction is reasonable. Multiple features align with the detected behavior."
      : "! LOW CONFIDENCE: The prediction may vary. Consider re-analyzing with a clearer handwriting sample."
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• For best results, provide a clear handwriting sample with natural
  writing patterns and adequate size.

• Behavioral analysis based on graphology is a supportive tool and
  should not replace professional psychological assessment.

• Multiple analyses can reveal behavioral patterns over time.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report generated by Handwriting Behavior Detection System
Visit our mood suggestions and movie recommendations for personalized insights.
    `.trim()

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `behavior-analysis-${new Date().toISOString().split("T")[0]}.txt`
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
            <p className="text-2xl font-bold text-cyan-500">{Math.min(100, (confidence * 100).toFixed(2))}%</p>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, confidence * 100)}%` }}
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs font-semibold mb-1">OVERALL ACCURACY</p>
          <p className="text-2xl font-bold text-green-500">{Math.min(100, overallAccuracy).toFixed(1)}%</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs font-semibold mb-1">MODEL ACCURACY</p>
          <p className="text-2xl font-bold text-blue-500">{Math.min(100, modelAccuracy).toFixed(1)}%</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs font-semibold mb-1">FEATURE CONSISTENCY</p>
          <p className="text-2xl font-bold text-purple-500">{Math.min(100, featureConsistency)}%</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs font-semibold mb-1">ENTROPY</p>
          <p className="text-2xl font-bold text-amber-500">{entropy}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs font-semibold mb-1">PROCESSING TIME</p>
          <p className="text-2xl font-bold text-cyan-500">{result.processingTime || "N/A"}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-xs font-semibold mb-1">CONFIDENCE</p>
          <p className="text-2xl font-bold text-emerald-500">{Math.min(100, (confidence * 100).toFixed(1))}%</p>
        </div>
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

      {/* Feature Metrics */}
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Handwriting Features & Reliability
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-2">SLANT ANGLE</p>
            <p className="text-3xl font-bold text-cyan-500 mb-1">{result.slant_angle?.toFixed(1) || "N/A"}°</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-600 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full"
                  style={{ width: `${featureMetrics.slantAngleReliability || 0}%` }}
                />
              </div>
              <span className="text-slate-400 text-xs">{featureMetrics.slantAngleReliability || 0}%</span>
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-2">LETTER SIZE</p>
            <p className="text-3xl font-bold text-purple-500 mb-1">{result.avg_size?.toFixed(1) || "N/A"}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-600 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-full"
                  style={{ width: `${featureMetrics.letterSizeReliability || 0}%` }}
                />
              </div>
              <span className="text-slate-400 text-xs">{featureMetrics.letterSizeReliability || 0}%</span>
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold mb-2">STROKE WIDTH</p>
            <p className="text-3xl font-bold text-emerald-500 mb-1">{result.stroke?.toFixed(3) || "N/A"}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-600 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${featureMetrics.strokeWidthReliability || 0}%` }}
                />
              </div>
              <span className="text-slate-400 text-xs">{featureMetrics.strokeWidthReliability || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Suggestions & Movie Recommendations - Collapsible Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Mood Suggestions Toggle */}
        <button
          onClick={() => setShowMoodSuggestions(!showMoodSuggestions)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Lightbulb className="w-5 h-5" />
          Mood Improvement Tips
        </button>

        {/* Movie Recommendations Toggle */}
        <button
          onClick={() => setShowMovies(!showMovies)}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Film className="w-5 h-5" />
          Movie Recommendations
        </button>
      </div>

      {/* Mood Suggestions Component */}
      {showMoodSuggestions && <MoodSuggestions behavior={primaryBehavior} />}

      {/* Movie Recommendations Component */}
      {showMovies && <MovieRecommendations behavior={primaryBehavior} />}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Detailed Report
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
