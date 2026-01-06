"use client"

import { useState, useRef } from "react"
import { Upload, Loader2, AlertCircle } from "lucide-react"
import PredictionResult from "./prediction-result"

export default function ImageUploader({ onPredictionComplete }) {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setImage(file)
    setError(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      setError("Please select an image")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", image)

      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Prediction failed")
      }

      const data = await response.json()
      setResult(data)
      onPredictionComplete(data)
    } catch (err) {
      setError("Failed to process image. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (result) {
    return (
      <div>
        <PredictionResult result={result} onReset={handleReset} preview={preview} />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Input Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative border-2 border-dashed border-slate-600 rounded-2xl p-12 text-center cursor-pointer hover:border-cyan-500 hover:bg-slate-700/20 transition-all"
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

        {preview ? (
          <div className="space-y-4">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
            <p className="text-sm text-slate-400">Click to change image</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-cyan-500" />
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Drop your handwriting image here</p>
              <p className="text-sm text-slate-400 mt-1">or click to browse your files</p>
            </div>
            <p className="text-xs text-slate-500">PNG, JPG, GIF, WebP • Up to 5MB</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      {preview && (
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Predict Behavior
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
          >
            Clear
          </button>
        </div>
      )}
    </form>
  )
}
