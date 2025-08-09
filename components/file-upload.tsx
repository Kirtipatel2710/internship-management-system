"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"
import { Upload, X, FileText, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface FileUploadProps {
  bucket: string
  path: string
  accept?: string
  maxSize?: number // in MB
  onUploadComplete: (url: string) => void
  currentFile?: string
  label?: string
}

export function FileUpload({
  bucket,
  path,
  accept = ".pdf,.doc,.docx",
  maxSize = 10,
  onUploadComplete,
  currentFile,
  label = "Upload File",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${path}/${fileName}`

      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath)

      onUploadComplete(publicUrl)
      toast({
        title: "File uploaded successfully",
        description: "Your file has been uploaded.",
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0])
    }
  }

  const removeFile = async () => {
    if (currentFile) {
      // Extract file path from URL for deletion
      const urlParts = currentFile.split("/")
      const filePath = urlParts.slice(-2).join("/") // Get last two parts (folder/filename)

      try {
        await supabase.storage.from(bucket).remove([filePath])
        onUploadComplete("")
        toast({
          title: "File removed",
          description: "Your file has been removed.",
        })
      } catch (error) {
        console.error("Error removing file:", error)
      }
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {currentFile ? (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">File uploaded</span>
          </div>
          <Button variant="ghost" size="sm" onClick={removeFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <div className="space-y-2">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            ) : (
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium">
                {uploading ? "Uploading..." : "Drop your file here, or click to browse"}
              </p>
              <p className="text-xs text-gray-500">Supports PDF, DOC, DOCX up to {maxSize}MB</p>
            </div>
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              Choose File
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
