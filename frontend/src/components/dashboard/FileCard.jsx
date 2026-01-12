import { useState } from 'react'
import { File, FileImage, FileText, Video, Music, Archive } from 'lucide-react'
import { formatDate, formatFileSize } from '../../utils/formatData.js'

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

    if (imageExts.includes(ext)) return { icon: Image, color: 'text-purple-400' }
    if (videoExts.includes(ext)) return { icon: Video, color: 'text-pink-400' }
    if (audioExts.includes(ext)) return { icon: Music, color: 'text-green-400' }
    if (docExts.includes(ext)) return { icon: FileText, color: 'text-blue-400' }
    if (archiveExts.includes(ext)) return { icon: Archive, color: 'text-yellow-400' }

    // Last resort
    return { icon: File, color: 'text-zinc-400'}
}

export default function FileCard({ file, loading = false}){
    const [selected, setSelected] = useState(false)

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

    const isImage = file.mimeType.startsWith('image/')

    const handleClick = () => {
        console.log('File clicked:', file.id)
        window.open(file.url, '_blank')
    }

    return (
        <div 
            className="group relative bg-surface border border-zinc-800/60 hover:border-zinc-600 rounded-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.01]"
            onClick={handleClick}
        >
            <div className="aspect-4/3 bg-zinc-900 relative overflow-hidden flex items-center justify-center">
                {isImage ? (
                    <img 
                        src={file.url} 
                        alt={file.originalName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback to icon if image fails to load
                            e.target.style.display = 'none'
                            e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span class="text-zinc-600">${Icon.name}</span></div>`
                        }}
                    />
                ) : (
                    <Icon className='text-zinc-600' size={32} />
                )}

                {/* Selection checkbox */}
                <div 
                    onClick={(e) => {
                        e.stopPropagation()
                        setSelected(!selected)
                    }}
                    className={`absolute top-2 left-2 w-4 h-4 border rounded-[3px] bg-black/40 transition-all flex items-center justify-center cursor-pointer ${
                        selected 
                            ? 'bg-blue-500 border-blue-500 opacity-100' 
                            : 'border-zinc-600 opacity-0 group-hover:opacity-100 hover:bg-blue-500 hover:border-blue-500'
                    }`}
                >
                    {selected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>

            <div className="p-3 bg-surface border-t border-zinc-800">
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