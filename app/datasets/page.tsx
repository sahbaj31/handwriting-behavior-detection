"use client"

import { useState } from "react"
import { Plus, Info } from "lucide-react"
import DatasetUploader from "@/components/dataset-uploader"
import DatasetManager from "@/components/dataset-manager"

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<"manage" | "upload">("manage")

  const handleDatasetUpload = (newDataset: any) => {
    setDatasets([newDataset, ...datasets])
    setActiveTab("manage")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-white">Dataset Management</h1>
          <p className="text-slate-400 mt-2">Manage training datasets for model improvement</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "manage"
                ? "border-cyan-500 text-cyan-500"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Manage Datasets
            </div>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === "upload"
                ? "border-cyan-500 text-cyan-500"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Dataset
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "manage" ? (
          <DatasetManager datasets={datasets} />
        ) : (
          <DatasetUploader onUploadComplete={handleDatasetUpload} />
        )}

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-2">Organize by Behavior</h3>
            <p className="text-sm text-slate-400">
              Keep handwriting samples organized by behavioral categories for better model training.
            </p>
          </div>
          <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-2">Batch Operations</h3>
            <p className="text-sm text-slate-400">
              Upload multiple images at once and label them with their corresponding behavior class.
            </p>
          </div>
          <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
            <h3 className="font-bold text-white mb-2">Export & Train</h3>
            <p className="text-sm text-slate-400">
              Export your datasets and use them with our training pipeline to improve model accuracy.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
