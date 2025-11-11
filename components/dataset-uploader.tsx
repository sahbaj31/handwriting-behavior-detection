"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react"

const BEHAVIOR_OPTIONS = ["Calm", "Stressed", "Angry", "Focused", "Happy"]

export default function DatasetUploader({ onUploadComplete }: { onUploadComplete: (dataset: any) => void }) {
  const [datasetName, setDatasetName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedBehavior, setSelectedBehavior] = useState("Calm")
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files
    if (!newFiles) return

    const validFiles = Array.from(newFiles).filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} exceeds 5MB limit`)
        return false
      }
      if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
        setError(`File ${file.name} is not a valid image format`)
        return false
      }
      return true
    })

    setFiles([...files, ...validFiles])
    setError(null)
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!datasetName.trim()) {
      setError("Dataset name is required")
      return
    }

    if (files.length === 0) {
      setError("Please select at least one image")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Simulate dataset upload
      const dataset = {
        id: Date.now(),
        name: datasetName,
        description,
        behavior: selectedBehavior,
        imageCount: files.length,
        files: files.map((f) => f.name),
        createdAt: new Date().toISOString(),
      }

      // In production, upload to storage service
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)
      onUploadComplete(dataset)

      // Reset form
      setDatasetName("")
      setDescription("")
      setSelectedBehavior("Calm")
      setFiles([])

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Failed to upload dataset. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Success Message */}
      {success && (
        <div className="flex gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-400 text-sm">Dataset uploaded successfully!</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white font-semibold mb-2">Dataset Name</label>
          <input
            type="text"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            placeholder="e.g., Calm Handwriting Set 1"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">Behavior Class</label>
          <select
            value={selectedBehavior}
            onChange={(e) => setSelectedBehavior(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
          >
            {BEHAVIOR_OPTIONS.map((behavior) => (
              <option key={behavior} value={behavior}>
                {behavior}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your dataset, source, or any notes..."
          rows={3}
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
        />
      </div>

      {/* File Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-600 rounded-2xl p-12 text-center cursor-pointer hover:border-cyan-500 hover:bg-slate-700/20 transition-all"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFilesChange}
          className="hidden"
        />

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-cyan-500" />
          </div>
        </div>
        <p className="text-lg font-semibold text-white">Drop images here to add to dataset</p>
        <p className="text-sm text-slate-400 mt-1">or click to browse your files</p>
        <p className="text-xs text-slate-500 mt-2">PNG, JPG, GIF, WebP • Up to 5MB each • Multiple files supported</p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-slate-700/30 rounded-lg border border-slate-600 p-6">
          <h3 className="text-white font-semibold mb-4">Selected Images ({files.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-48 overflow-y-auto">
            {files.map((file, idx) => (
              <div key={idx} className="relative group">
                <div className="p-3 bg-slate-700 rounded-lg border border-slate-600 h-full flex items-center justify-center">
                  <p className="text-xs text-slate-300 text-center truncate">{file.name}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(idx)
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isUploading}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-semibold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Uploading Dataset...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            Create Dataset ({files.length} images)
          </>
        )}
      </button>
    </form>
  )
}
