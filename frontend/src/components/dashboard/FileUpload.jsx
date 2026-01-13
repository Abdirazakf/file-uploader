import { useState, useRef } from 'react'
import { Upload, Trash2 } from 'lucide-react'
import { useUploadMultipleFiles, useFileUploading } from '../../states/useFileStore'

export default function FileUpload({ onUpload, folderId = null }) {
    const [isDragging, setIsDragging] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([])
    const fileInputRef = useRef(null)
    
    const uploadMultipleFiles = useUploadMultipleFiles()
    const uploading = useFileUploading()

    const handleDragEnter = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }

    const handleDrop = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)

        const files = Array.from(event.dataTransfer.files)
        if (files.length > 0) {
            setSelectedFiles(files)
        }
    }

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files || [])
        if (files.length > 0) {
            setSelectedFiles(files)
        }
    }

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return

        const results = await uploadMultipleFiles(selectedFiles, folderId)
        
        // Call parent callback if provided
        if (onUpload) {
            onUpload(results.filter(r => r !== null))
        }

        // Clear selected files after upload
        setSelectedFiles([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <div className="mb-8">
            {/* Drop Zone */}
            <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-all duration-200
                    ${isDragging 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30'
                    }
                    ${uploading ? 'opacity-50 pointer-events-none' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                />

                <Upload className={`mx-auto mb-4 ${isDragging ? 'text-blue-400' : 'text-zinc-600'}`} size={40} />
                
                <h3 className="text-sm font-medium text-zinc-300 mb-1">
                    {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
                </h3>
                <p className="text-xs text-zinc-500">
                    Upload any files up to 50MB
                </p>

                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                        <div className="text-sm text-zinc-300">Uploading...</div>
                    </div>
                )}
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-zinc-300">
                            Selected Files ({selectedFiles.length})
                        </h4>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Uploading...' : 'Upload Files'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-sm"
                            >
                                <div className="flex-1 min-w-0 mr-4">
                                    <p className="text-sm text-zinc-200 truncate">{file.name}</p>
                                    <p className="text-xs text-zinc-500">{formatFileSize(file.size)}</p>
                                </div>
                                <button
                                    onClick={() => handleRemoveFile(index)}
                                    disabled={uploading}
                                    className="p-1 hover:bg-zinc-800 rounded transition-colors disabled:opacity-50"
                                >
                                    <Trash2 size={16} className="text-zinc-400" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}