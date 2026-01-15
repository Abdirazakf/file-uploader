import { X, Download, Trash2 } from 'lucide-react'
import { getFileIcon, getFileType } from '../utils/getFileIcon'
import { formatDate, formatSize } from '../utils/formatData'
import { useDeleteFile } from '../states/useFileStore'
import { useState } from 'react'

export default function RightSidebar({ file, onClose, onFileUpdate }) {
    const [isDeleting, setIsDeleting] = useState(false)
    const deleteFile = useDeleteFile()

    if (!file) return null

    const { icon: Icon, color } = getFileIcon(file.mimeType, file.originalName)
    const fileType = getFileType(file.mimeType, file.originalName)
    const size = formatSize(file.size)
    const createdDate = formatDate(file.createdAt)
    const isImage = file.mimeType?.startsWith('image/')

    const handleDownload = () => {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a')
        link.href = file.url
        link.download = file.originalName
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${file.originalName}"? This cannot be undone.`)) {
            return
        }

        setIsDeleting(true)
        const result = await deleteFile(file.id)

        if (result) {
            if (onFileUpdate) onFileUpdate()
            onClose()
        }

        setIsDeleting(false)
    }

    return (
        <aside className="flex flex-col w-80 bg-background border-l border-border h-full z-10 shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.5)]">
            {/* Header */}
            <div className="h-14 border-b border-border flex items-center justify-between px-4">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Details
                </span>
                <button 
                    onClick={onClose}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* File Preview */}
                <div className="w-full aspect-video bg-zinc-900 rounded-sm border border-zinc-800 flex items-center justify-center mb-6 relative overflow-hidden group">
                    {isImage ? (
                        <img 
                            src={file.url} 
                            alt={file.originalName}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.parentElement.innerHTML = `
                                    <div class="flex items-center justify-center w-full h-full">
                                        <svg class="w-16 h-16 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                `
                            }}
                        />
                    ) : (
                        <Icon className={`${color} w-16 h-16`} />
                    )}
                </div>

                {/* File Metadata */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-zinc-100 mb-1 leading-tight tracking-tight break-words">
                            {file.originalName}
                        </h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-xs py-2 border-b border-zinc-800/50">
                            <span className="text-zinc-500">Type</span>
                            <span className="text-zinc-300">{fileType}</span>
                        </div>
                        <div className="flex justify-between text-xs py-2 border-b border-zinc-800/50">
                            <span className="text-zinc-500">Size</span>
                            <span className="text-zinc-300">{size}</span>
                        </div>
                        {file.folder && (
                            <div className="flex justify-between text-xs py-2 border-b border-zinc-800/50">
                                <span className="text-zinc-500">Folder</span>
                                <span className="text-zinc-300">{file.folder.name}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-xs py-2 border-b border-zinc-800/50">
                            <span className="text-zinc-500">Created</span>
                            <span className="text-zinc-300">{createdDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 border-t border-border bg-surface/50 space-y-2">
                <button
                    onClick={handleDownload}
                    className="cursor-pointer w-full py-2 bg-zinc-100 hover:bg-white text-black text-xs font-medium rounded-[2px] transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                    <Download size={14} />
                    Download
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="cursor-pointer w-full py-2 bg-transparent hover:bg-red-500/10 hover:border-red-500/30 text-zinc-400 hover:text-red-500 text-xs font-medium rounded-[2px] transition-colors border border-zinc-800 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Trash2 size={14} />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </aside>
    )
}