import { File, FileImage, FileText, Video, Music, Archive } from 'lucide-react'

export const getFileIcon = (mimeType, fileName) => {
    if (mimeType) {
        if (mimeType.startsWith('image/')) return { icon: FileImage, color: 'text-purple-400' }
        if (mimeType.startsWith('video/')) return { icon: Video, color: 'text-pink-400' }
        if (mimeType.startsWith('audio/')) return { icon: Music, color: 'text-green-400' }
        if (mimeType === 'application/pdf') return { icon: FileText, color: 'text-red-400' }
        if (mimeType.startsWith('text/')) return { icon: FileText, color: 'text-blue-400' }
        if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
            return { icon: Archive, color: 'text-yellow-400' }
        }
    }

    // Fallback to file extensions
    const ext = fileName?.split('.').pop()?.toLowerCase()

    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
    const videoExts = ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv']
    const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac']
    const docExts = ['pdf', 'doc', 'docx', 'txt', 'md', 'rtf']
    const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2']

    if (ext && imageExts.includes(ext)) return { icon: FileImage, color: 'text-purple-400' }
    if (ext && videoExts.includes(ext)) return { icon: Video, color: 'text-pink-400' }
    if (ext && audioExts.includes(ext)) return { icon: Music, color: 'text-green-400' }
    if (ext && docExts.includes(ext)) return { icon: FileText, color: 'text-blue-400' }
    if (ext && archiveExts.includes(ext)) return { icon: Archive, color: 'text-yellow-400' }

    // Last resort
    return { icon: File, color: 'text-zinc-400' }
}