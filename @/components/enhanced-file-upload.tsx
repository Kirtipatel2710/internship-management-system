"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud, FileText, XCircle, CheckCircle2 } from "lucide-react"
import { toast } from "@/components/ui/sonner"

interface EnhancedFileUploadProps {
  onFileUpload: (fileUrls: string[]) => void
  maxFiles?: number
  maxSizeMb?: number
  acceptedFileTypes?: string[] // e.g., ["image/jpeg", "application/pdf"]
  disabled?: boolean
}

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "pending" | "uploading" | "success" | "failed"
  progress: number
  url?: string
  error?: string
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export function EnhancedFileUpload({
  onFileUpload,
  maxFiles = 1,
  maxSizeMb = 5,
  acceptedFileTypes = [
    "image/*",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  disabled = false,
}: EnhancedFileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      if (disabled) return

      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(2, 15), // Simple unique ID
        name: file.name,
        size: file.size,
        status: "pending",
        progress: 0,
      }))

      setFiles((prevFiles) => {
        const currentCount = prevFiles.filter((f) => f.status !== "failed").length
        const availableSlots = maxFiles - currentCount
        const filesToAdd = newFiles.slice(0, availableSlots)

        if (newFiles.length > availableSlots) {
          toast.warning("File Limit Exceeded", {
            description: `You can only upload a maximum of ${maxFiles} files.`,
          })
        }
        return [...prevFiles, ...filesToAdd]
      })

      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((err: any) => {
          if (err.code === "file-too-large") {
            toast.error("File Too Large", {
              description: `${file.name} is larger than ${maxSizeMb}MB.`,
            })
          } else if (err.code === "file-invalid-type") {
            toast.error("Invalid File Type", {
              description: `${file.name} is not a supported file type.`,
            })
          } else {
            toast.error("File Error", {
              description: `${file.name}: ${err.message}`,
            })
          }
        })
      })
    },
    [maxFiles, maxSizeMb, disabled],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: maxFiles,
    maxSize: maxSizeMb * 1024 * 1024, // Convert MB to bytes
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    disabled: disabled || files.filter((f) => f.status !== "failed").length >= maxFiles,
  })

  const handleUpload = async (fileToUpload: UploadedFile, fileBlob: File) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.id === fileToUpload.id ? { ...f, status: "uploading", progress: 0 } : f)),
    )

    // Simulate file upload
    const uploadPromise = new Promise<string>((resolve, reject) => {
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += 10
        if (currentProgress <= 100) {
          setFiles((prevFiles) =>
            prevFiles.map((f) => (f.id === fileToUpload.id ? { ...f, progress: currentProgress } : f)),
          )
        }
        if (currentProgress >= 100) {
          clearInterval(interval)
          // Simulate success or failure
          if (Math.random() > 0.1) {
            // 90% success rate
            resolve(`/uploads/${fileToUpload.name}`) // Simulate a URL
          } else {
            reject(new Error("Upload failed due to network error."))
          }
        }
      }, 100)
    })

    try {
      const url = await uploadPromise
      setFiles((prevFiles) => prevFiles.map((f) => (f.id === fileToUpload.id ? { ...f, status: "success", url } : f)))
      onFileUpload(
        files
          .filter((f) => f.status === "success")
          .map((f) => f.url!)
          .concat(url),
      )
      toast.success("Upload Complete", {
        description: `${fileToUpload.name} has been uploaded successfully.`,
      })
    } catch (error: any) {
      setFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === fileToUpload.id ? { ...f, status: "failed", error: error.message } : f)),
      )
      toast.error("Upload Failed", {
        description: `${fileToUpload.name}: ${error.message}`,
      })
    }
  }

  const handleRemove = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id))
    onFileUpload(files.filter((f) => f.id !== id && f.status === "success").map((f) => f.url!))
  }

  const pendingFiles = files.filter((f) => f.status === "pending")
  const uploadingFiles = files.filter((f) => f.status === "uploading")
  const uploadedFiles = files.filter((f) => f.status === "success")
  const failedFiles = files.filter((f) => f.status === "failed")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>File Upload</CardTitle>
        <CardDescription>
          Drag and drop your files here, or click to select. Max {maxFiles} file(s), up to {maxSizeMb}MB each.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer
            ${isDragActive ? "border-primary bg-muted" : "border-input bg-background"}
            ${disabled ? "cursor-not-allowed opacity-70" : "hover:bg-muted/50"}
          `}
        >
          <input {...getInputProps()} disabled={disabled} />
          <UploadCloud className="w-12 h-12 mb-3 text-muted-foreground" />
          <p className="mb-2 text-sm text-muted-foreground">
            {isDragActive ? "Drop the files here..." : "Drag 'n' drop files here, or click to select files"}
          </p>
          <p className="text-xs text-muted-foreground">
            Supported types: {acceptedFileTypes.map((type) => type.split("/")[1] || type).join(", ")}
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {file.status === "uploading" && (
                    <div className="flex items-center gap-2">
                      <Progress value={file.progress} className="w-24 h-2" />
                      <span className="text-xs text-muted-foreground">{file.progress}%</span>
                    </div>
                  )}
                  {file.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpload(file, new File([], file.name, { size: file.size }))} // Pass a dummy File object
                      disabled={disabled}
                    >
                      Upload
                    </Button>
                  )}
                  {file.status === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {file.status === "failed" && (
                    <div className="flex items-center gap-1 text-red-500">
                      <XCircle className="h-5 w-5" />
                      <span className="text-xs">{file.error || "Failed"}</span>
                    </div>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleRemove(file.id)} disabled={disabled}>
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
