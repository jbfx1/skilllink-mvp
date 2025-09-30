import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, X, File, Image, FileText, Loader2 } from 'lucide-react'
import { storageService } from '@/lib/storage'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export const FileUploader = ({
  onUpload,
  bucket = 'attachments',
  path = '',
  accept = '*',
  maxSize = 10 * 1024 * 1024,
  multiple = false,
  showPreview = true,
  className
}) => {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || [])

    // Validate files
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds maximum size`)
        return false
      }
      return true
    })

    if (multiple) {
      setFiles(prev => [...prev, ...validFiles])
    } else {
      setFiles(validFiles)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFiles = Array.from(e.dataTransfer.files || [])

    const validFiles = droppedFiles.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds maximum size`)
        return false
      }
      return true
    })

    if (multiple) {
      setFiles(prev => [...prev, ...validFiles])
    } else {
      setFiles(validFiles)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)

    try {
      const uploadPromises = files.map(async (file, index) => {
        const filePath = path ? `${path}/${file.name}` : file.name
        const result = await storageService.uploadFile(file, bucket, filePath)

        setProgress(((index + 1) / files.length) * 100)

        return result
      })

      const results = await Promise.all(uploadPromises)

      const successful = results.filter(r => !r.error)
      const failed = results.filter(r => r.error)

      if (successful.length > 0) {
        toast.success(`${successful.length} file(s) uploaded successfully`)
        if (onUpload) {
          onUpload(successful.map(r => r.data))
        }
        setFiles([])
      }

      if (failed.length > 0) {
        toast.error(`${failed.length} file(s) failed to upload`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload files')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />
    } else if (file.type.includes('pdf') || file.type.includes('document')) {
      return <FileText className="h-8 w-8 text-red-500" />
    } else {
      return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const getPreviewUrl = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file)
    }
    return null
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <Card
        className="border-2 border-dashed cursor-pointer hover:bg-accent/50 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm font-medium mb-2">
            Drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum file size: {storageService.formatBytes(maxSize)}
          </p>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {showPreview && getPreviewUrl(file) ? (
                    <img
                      src={getPreviewUrl(file)}
                      alt={file.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    getFileIcon(file)
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {storageService.formatBytes(file.size)}
                    </p>
                  </div>

                  {!uploading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-center text-muted-foreground">
                Uploading... {Math.round(progress)}%
              </p>
            </div>
          )}

          {!uploading && (
            <Button onClick={uploadFiles} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload {files.length} file{files.length > 1 ? 's' : ''}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}