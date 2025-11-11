"use client"

import { Download, Trash2, FileJson } from "lucide-react"

export default function DatasetManager({ datasets }: { datasets: any[] }) {
  const handleExport = (dataset: any) => {
    // Create labels CSV file
    const csvContent = dataset.files.map((file: string) => `${file},${getBehaviorIndex(dataset.behavior)}`).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${dataset.name}-labels.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleDelete = (datasetId: number) => {
    if (confirm("Are you sure you want to delete this dataset?")) {
      // Delete dataset
    }
  }

  const getBehaviorIndex = (behavior: string) => {
    const map: Record<string, number> = {
      Calm: 0,
      Stressed: 1,
      Angry: 2,
      Focused: 3,
      Happy: 4,
    }
    return map[behavior] || 0
  }

  if (datasets.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-4">
          <FileJson className="w-8 h-8 text-slate-500" />
        </div>
        <p className="text-slate-400 text-lg">No datasets yet. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {datasets.map((dataset) => (
        <div
          key={dataset.id}
          className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-cyan-500 transition-colors"
        >
          <div className="p-6">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-white text-lg">{dataset.name}</h3>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold">
                  {dataset.behavior}
                </span>
              </div>
              {dataset.description && <p className="text-sm text-slate-400">{dataset.description}</p>}
            </div>

            {/* Stats */}
            <div className="mb-6 p-4 bg-slate-700/30 rounded-lg">
              <p className="text-2xl font-bold text-cyan-500">{dataset.imageCount}</p>
              <p className="text-sm text-slate-400">images</p>
            </div>

            {/* Metadata */}
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Created:</span>
                <span>{new Date(dataset.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Size:</span>
                <span>{(dataset.imageCount * 0.5).toFixed(1)} MB (est.)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleExport(dataset)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => handleDelete(dataset.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
