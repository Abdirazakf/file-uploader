import { Folder, MoreVertical } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router"

const FOLDER_COLORS = [
    'text-blue-400',
    'text-purple-400', 
    'text-pink-400',
    'text-yellow-400',
    'text-green-400',
    'text-cyan-400',
]

export default function FolderCard({ folder, index, viewMode = 'grid', loading = false}){
    const [showMenu, setShowMenu] = useState(false)
    
    if (loading) {
        if (viewMode === 'list') {
            return (
                <div className="relative bg-zinc-900/30 border border-zinc-800/40 rounded-sm overflow-hidden p-3">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-zinc-800 rounded animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-1/3 bg-zinc-800 rounded animate-pulse"></div>
                            <div className="h-2 w-1/4 bg-zinc-800/50 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="relative bg-zinc-900/30 border border-zinc-800/40 rounded-sm overflow-hidden">
                <div className="p-3 space-y-3">
                    <div className="w-5 h-5 bg-zinc-800 rounded animate-pulse"></div>
                    
                    <div className="space-y-2">
                        <div className="h-3 w-2/3 bg-zinc-800 rounded animate-pulse"></div>
                        <div className="h-2 w-1/2 bg-zinc-800/50 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        )
    }
    
    const color = FOLDER_COLORS[index % FOLDER_COLORS.length]
    const isTemp = folder.id.toString().startsWith('temp-')

    // Folder stats
    const fileCount = folder._count.files || 0
    const subfolderCount = folder._count.subfolders || 0
    const total = fileCount + subfolderCount

    const getItemText = () => {
        if (total === 0) return 'Empty'
        if (total === 1) return '1 item'
        return `${total} items`
    }

    // Placeholder size until logic implemented on backend
    const size = '0 MB'

    if (viewMode === 'list'){
        return (
            <Link to={`/folder/${folder.id}`}>
                <div className={`group flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900 rounded-sm cursor-pointer transition-all ${isTemp ? 'opacity-60' : ''}`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Folder size={20} className={color} />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-zinc-200 truncate">
                                {folder.name}
                            </h3>
                            <p className="text-[10px] text-zinc-500">
                                {getItemText()} - {size}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            setShowMenu(!showMenu)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 rounded transition-opacity text-zinc-400"
                    >
                        <MoreVertical size={14} />
                    </button>
                </div>
            </Link>
        )
    }

    return (
        <Link to={`/folder/${folder.id}`}>
            <div className={`group relative p-3 bg-zinc-900/30 border border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg rounded-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${isTemp ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                    <Folder size={20} className={color} />
                    <button 
                        onClick={(e) => {
                            e.preventDefault()
                            setShowMenu(!showMenu)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 rounded transition-opacity text-zinc-400"
                    >
                        <MoreVertical size={14} />
                    </button>
                </div>

                <div className="space-y-0.5">
                    <h3 className="text-sm font-medium text-zinc-200 truncate">
                        {folder.name}
                    </h3>
                    <p className="text-[10px] text-zinc-500">
                        {getItemText()} · {size}
                    </p>
                </div>

                {isTemp && (
                    <div className="absolute top-2 right-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    </div>
                )}
            </div>
        </Link>
    )
}