import { useEffect, useState } from 'react'
import { useAuthStore } from '../../states/useAuthStore'
import { Link, useLocation } from 'react-router'
import { Box, ChevronDown, ChevronRight, Clock, Folder, FolderOpen, LayoutGrid, MoreHorizontal, Plus, Power } from 'lucide-react'
import { useFolders, useFetchFolders, useCreateFolder, useFolderStoreLoading } from '../../states/useFolderStore'
import { FOLDER_COLORS } from '../../constants/colorPalettes'

export default function LeftSidebar(){
    const { user, logoutUser } = useAuthStore()

    const folders = useFolders()
    const loading = useFolderStoreLoading()
    const fetchFolders = useFetchFolders()
    const createFolder = useCreateFolder()
    
    const [creatingFolder, setCreatingFolder] = useState(false)
    const [expandedFolders, setExpandedFolders] = useState(new Set())
    const [showInput, setShowInput] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')
    const location = useLocation()

    useEffect(() => {
        fetchFolders()
    }, [fetchFolders])

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!newFolderName.trim()) return

        setCreatingFolder(true)
        await createFolder(newFolderName.trim())
        setNewFolderName('')
        setShowInput(false)
        setCreatingFolder(false)
    }

    const toggleFolder = (folderId) => {
        setExpandedFolders(prev => {
            const newSet = new Set(prev)
            if (newSet.has(folderId)){
                newSet.delete(folderId)
            } else {
                newSet.add(folderId)
            }
            return newSet
        })
    }

    const isActiveRoute = (path) => {
        return location.pathname === path
    }

    const getFolderColor = (index) => {
        return FOLDER_COLORS[index % FOLDER_COLORS.length]
    }

    const getInitials = (name) => {
        return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    
    return (
        <aside className='hidden md:flex flex-col w-64 border-r border-border h-full bg-surface/30 pt-6'>
            {/* Header */}
            <div className="px-5 mb-8 flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2.5 text-zinc-100 font-semibold tracking-tight text-sm">
                    <div className="w-6 h-6 bg-zinc-100 text-black flex items-center justify-center rounded-sm">
                        <Box size={14} />
                    </div>
                    <span>UR FILES</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronDown size={14} className="text-zinc-500" />
                </div>
            </div>

            {/* Navbar */}
            <nav className="flex-1">
                <div className="mb-4">
                    <p className="px-2 text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
                        Drive
                    </p>
                    <Link to={'/'}>
                        <div className={`flex items-center gap-3 px-2 py-1.5 rounded-sm text-sm group transition-colors ${
                            isActiveRoute('/') 
                                ? 'bg-zinc-800/50 text-zinc-100 border border-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.2)]' 
                                : 'hover:bg-zinc-800/30 hover:text-zinc-200 text-zinc-400'
                        }`}>
                            <LayoutGrid size={16} className={isActiveRoute('/') ? 'text-white' : ''} />
                            <span className="font-medium">Dashboard</span>
                        </div>
                    </Link>

                    <Link to={'/all-files'}>
                        <div className={`flex items-center gap-3 px-2 py-1.5 rounded-sm text-sm transition-colors ${
                            isActiveRoute('/all-files')
                                ? 'bg-zinc-800/50 text-zinc-100 border border-zinc-800'
                                : 'hover:bg-zinc-800/30 hover:text-zinc-200 text-zinc-400'
                        }`}>
                            <FolderOpen size={16} />
                            <span className="font-medium">All Files</span>
                        </div>
                    </Link>

                    <Link to={'/recent'}>
                        <div className={`flex items-center gap-3 px-2 py-1.5 rounded-sm text-sm transition-colors ${
                            isActiveRoute('/recent')
                                ? 'bg-zinc-800/50 text-zinc-100 border border-zinc-800'
                                : 'hover:bg-zinc-800/30 hover:text-zinc-200 text-zinc-400'
                        }`}>
                            <Clock size={16} />
                            <span className="font-medium">Recent</span>
                        </div>                        
                    </Link>
                </div>

                {/* Folders */}
                <div className="mb-4">
                    <div className="flex items-center justify-between px-2 mb-2 group">
                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                            Folders
                        </p>
                        <button onClick={() => setShowInput(true)}
                        className='cursor-pointer opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white transition-opacity'
                        >
                            <Plus size={12} />
                        </button>
                    </div>

                    {/* New Folder Input */}
                    {showInput && (
                        <form onSubmit={handleSubmit} className='px-2 mb-2'>
                            <input
                                type='text'
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                autoFocus
                                disabled={creatingFolder}
                                className="w-full h-7 px-2 bg-zinc-900/50 border border-zinc-800 rounded-sm text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                                onBlur={() => {
                                    if (!newFolderName.trim()){
                                        setShowInput(false)
                                    }
                                }}
                            />
                        </form>
                    )}

                    {/* Folder List */}
                    {loading ? (
                        <div className="px-2 text-xs text-zinc-500">Loading folders...</div>
                    ) : folders.length === 0 ? (
                        <div className="px-2 text-xs text-zinc-500">No folders yet</div>
                    ) : (
                        <div className="pl-2 relative">
                            {folders.map((folder, index) => {
                                const color = getFolderColor(index)
                                const hasSubFolders = folder.subfolders && folder.subfolders.length > 0
                                const isExpanded = expandedFolders.has(folder.id)
                                const isTemp = folder.id.toString().startsWith('temp-')

                                return(
                                    <div key={folder.id} className={isTemp ? 'opacity-60' : ''}>
                                        <div className="relative pl-5 py-1 flex items-center gap-2 text-sm text-zinc-300 hover:text-white cursor-pointer group">
                                            <Link to={`/folder/${folder.id}`} className='flex items-center gap-2 flex-1 min-w-0'>
                                                <Folder size={14} className={color} />
                                                <span className="truncate">{folder.name}</span>
                                            </Link>
                                            {hasSubFolders && (
                                                <button onClick={() => toggleFolder(folder.id)}
                                                className='absolute left-0 text-zinc-600'
                                                >
                                                    {isExpanded ? (
                                                        <ChevronDown size={12} />
                                                    ) : (
                                                        <ChevronRight size={12} />
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Nested Folders */}
                                        {hasSubFolders && isExpanded && (
                                            <div className="pl-6 mt-1 space-y-1">
                                                {folder.subfolders.map((subfolder, subIndex) => {
                                                    const color = getFolderColor(subIndex)

                                                    return (
                                                        <Link
                                                            key={subfolder.id}
                                                            to={`/folder/${subfolder.id}`}
                                                            className='flex items-center gap-2 py-1 text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer group'>
                                                                <Folder size={12} className={color} />
                                                                <span className="truncate">{subfolder.name}</span>
                                                            </Link>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </nav>

            {/* User Profile */}
                <div className="flex items-center gap-3 pt-3 px-4 border-t border-border hover:bg-zinc-900/50 -mx-2 py-2 rounded-sm transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-xs text-white border border-zinc-600 font-medium">
                        {user ? getInitials(user.name) : 'U'}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-xs font-medium text-zinc-200 truncate">
                            {user?.name || 'User'}
                        </span>
                        <span className="text-[10px] text-zinc-500">Free Plan</span>
                    </div>
                    <button 
                        onClick={logoutUser}
                        className="group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <Power size={14} className="text-zinc-600 hover:text-zinc-300" />
                    </button>
                </div>
        </aside>
    )
}