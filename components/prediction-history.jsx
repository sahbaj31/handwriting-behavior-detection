"use client"

import { formatDistanceToNow } from "date-fns"
import { Calendar } from "lucide-react"

export default function PredictionHistory({ predictions }) {
  if (predictions.length === 0) {
    return (
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center">
        <p className="text-slate-400">No predictions yet. Upload your first handwriting sample to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
      <h3 className="text-xl font-bold text-white mb-4">Recent Analysis</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {predictions.map((pred, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-cyan-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-white">{pred.behavior}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  {pred.timestamp ? formatDistanceToNow(new Date(pred.timestamp), { addSuffix: true }) : "Just now"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-cyan-500">{(pred.confidence * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div className="flex gap-1">
              {Object.entries(pred.scores || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="flex-1 h-1 rounded-full bg-slate-600"
                  style={{
                    backgroundColor: key === pred.behavior ? "#06b6d4" : "#475569",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
