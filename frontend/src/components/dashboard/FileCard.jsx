import { useEffect, useRef, useState } from 'react'
import { File, EllipsisVertical, FileImage, Trash2, FileText, Video, Music, Archive } from 'lucide-react'
import { formatDate, formatFileSize } from '../../utils/formatData.js'
import { useDeleteFile } from '../../states/useFileStore.js'

const getFileIcon = (mimeType, fileName) => {
    if (mimeType){
        if (mimeType.startsWith('image/')) return { icon: FileImage, color: 'text-purple-400'}
        if (mimeType.startsWith('video/')) return { icon: Video, color: 'text-pink-400' }
        if (mimeType.startsWith('audio/')) return { icon: Music, color: 'text-green-400' }
        if (mimeType === 'application/pdf') return { icon: FileText, color: 'text-red-400' }
        if (mimeType.startsWith('text/')) return { icon: FileText, color: 'text-blue-400' }
        if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
            return { icon: Archive, color: 'text-yellow-400' }
        }
    }

    // Fallback to file extensions
    const ext = fileName.split('.').pop().toLowerCase()

    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
    const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv']
    const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac']
    const docExts = ['pdf', 'doc', 'docx', 'txt', 'md', 'rtf']
    const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2']

    if (imageExts.includes(ext)) return { icon: FileImage, color: 'text-purple-400' }
    if (videoExts.includes(ext)) return { icon: Video, color: 'text-pink-400' }
    if (audioExts.includes(ext)) return { icon: Music, color: 'text-green-400' }
    if (docExts.includes(ext)) return { icon: FileText, color: 'text-blue-400' }
    if (archiveExts.includes(ext)) return { icon: Archive, color: 'text-yellow-400' }

    // Last resort
    return { icon: File, color: 'text-zinc-400'}
}

export default function FileCard({ file, loading = false, onFileUpdate }){
    const [isDeleting, setIsDeleting] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const menuRef = useRef(null)
    const deleteFile = useDeleteFile()

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)){
                setShowMenu(false)
            }
        }

        if (showMenu){
            document.addEventListener('mousedown', handleOutsideClick)
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [showMenu])

    if (loading){
        return (
            <div className="bg-surface border border-zinc-800/40 rounded-sm overflow-hidden">
                <div className="aspect-4/3 bg-zinc-900/50 animate-pulse"></div>
                <div className="p-3 space-y-2">
                    <div className="h-3 w-2/3 bg-zinc-800 rounded animate-pulse"></div>
                    <div className="flex justify-between">
                        <div className="h-2 w-1/4 bg-zinc-800/50 rounded animate-pulse"></div>
                        <div className="h-2 w-1/4 bg-zinc-800/50 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        )
    }

    const { icon: Icon, color} = getFileIcon(file.mimeType, file.originalName)
    const size = formatFileSize(file.size)
    const date = formatDate(file.createdAt)
    const isImage = file.mimeType?.startsWith('image/')

    const handleClick = () => {
        console.log('File clicked:', file.id)
        window.open(file.url, '_blank')
    }

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${file.originalName}"? This cannot be undone`)){
            return
        }

        setIsDeleting(true)
        const result = await deleteFile(file.id)

        if (result){
            if (onFileUpdate) onFileUpdate()
        }

        setIsDeleting(false)
    }

    return (
        <div 
            className={`group relative bg-surface border border-zinc-800/60 hover:border-zinc-600 rounded-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.01] ${isDeleting ? 'opacity-60 pointer-events-none' : ''}`}
        >
            <div className="aspect-4/3 bg-zinc-900 relative overflow-hidden flex items-center justify-center">
                {isImage ? (
                    <img 
                        src={file.url} 
                        alt={file.originalName}
                        className="w-full h-full object-cover"
                        onError={(event) => {
                            event.target.style.display = 'none'
                        }}
                    />
                ) : (
                    <Icon className='text-zinc-600' size={32} />
                )}

                {/* Context Menu Button */}
                <div className="absolute top-2 right-2" ref={menuRef}>
                    <button
                        onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            setShowMenu(!showMenu)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 bg-black/40 hover:bg-black/60 rounded transition-all text-zinc-300 hover:text-white"
                    >
                        <EllipsisVertical size={14} />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-8 z-50 w-32 bg-zinc-900 border border-zinc-800 rounded-sm shadow-lg py-1">
                            <button
                                onClick={(event) => {
                                    event.stopPropagation()
                                    setShowMenu(false)
                                    handleDelete()
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-zinc-800 transition-colors"
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3 bg-surface border-t border-zinc-800" onClick={handleClick}>
                <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} className={color} />
                    <span className="text-xs font-medium text-zinc-200 truncate" title={file.originalName}>
                        {file.originalName}
                    </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>{size}</span>
                    <span>{date}</span>
                </div>
            </div>
        </div>
    )
}