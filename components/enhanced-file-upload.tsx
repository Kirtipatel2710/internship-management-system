"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabaseClient"
import { Upload, X, type File, CheckCircle, AlertCircle, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface EnhancedFileUploadProps {
  bucket: string
  path: string
  onUploadComplete: (url: string) => void
  currentFile?: string
  label?: string
  accept?: string
  maxSize?: number // in MB
  required?: boolean
  className?: string
}

export function EnhancedFileUpload({
  bucket,
  path,
  onUploadComplete,
  currentFile,
  label = "Upload File",
  accept = ".pdf,.doc,.docx",
  maxSize = 10,
  required = false,
  className,
}: EnhancedFileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    // Check file type
    const allowedTypes = accept.split(",").map((type) => type.trim())
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

    if (!allowedTypes.includes(fileExtension)) {
      return `File type not allowed. Accepted types: ${accept}`
    }

    return null
  }

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      toast({
        title: "Upload Error",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${path}/${Date.now()}.${fileExt}`

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (error) throw error

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName)

      onUploadComplete(publicUrl)

      toast({
        title: "Success! 🎉",
        description: "File uploaded successfully",
        variant: "success",
      })

      setTimeout(() => setProgress(0), 1000)
    } catch (error: any) {
      console.error("Upload error:", error)
      setError(error.message)
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    onUploadComplete("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setError(null)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {currentFile && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      {!currentFile ? (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/50",
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
            error ? "border-red-300 bg-red-50" : "",
            "animate-fade-in",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />

          <div className="space-y-4">
            <div
              className={cn(
                "flex items-center justify-center w-16 h-16 mx-auto rounded-2xl transition-all duration-300",
                dragActive ? "bg-blue-500" : "bg-gray-100",
                uploading ? "animate-pulse" : "",
              )}
            >
              <Upload
                className={cn("h-8 w-8 transition-colors duration-300", dragActive ? "text-white" : "text-gray-400")}
              />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {dragActive ? "Drop your file here" : "Upload your file"}
              </p>
              <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
              <p className="text-xs text-gray-400">
                Supported formats: {accept} • Max size: {maxSize}MB
              </p>
            </div>

            {!uploading && (
              <Button type="button" variant="outline" className="bg-white hover:bg-gray-50 border-gray-300">
                Choose File
              </Button>
            )}
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Uploading...</p>
                  <Progress value={progress} className="w-48 mx-auto" />
                  <p className="text-xs text-gray-500">{progress}% complete</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-2xl animate-slide-up">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-green-800">File uploaded successfully</p>
            <p className="text-sm text-green-600">Ready for submission</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            asChild
            className="text-green-600 hover:text-green-700 hover:bg-green-100"
          >
            <a href={currentFile} target="_blank" rel="noopener noreferrer">
              <Eye className="h-4 w-4 mr-1" />
              View
            </a>
          </Button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl animate-slide-up">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  )
}
