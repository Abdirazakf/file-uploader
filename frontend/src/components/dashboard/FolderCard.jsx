import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { Folder, EllipsisVertical, Edit2, Trash2 } from "lucide-react"
import { FOLDER_COLORS } from "../../constants/colorPalettes"
import { useDeleteFolder, useUpdateFolder } from "../../states/useFolderStore"

export default function FolderCard({ folder, index, viewMode = 'grid', loading = false, onFolderUpdate}){
    const [showMenu, setShowMenu] = useState(false)
    const [isRenaming, setIsRenaming] = useState(false)
    const [newName, setNewName] = useState(folder?.name || '')
    const [isDeleting, setIsDeleting] = useState(false)

    const menuRef = useRef(null)
    const updateFolder = useUpdateFolder()
    const deleteFolder = useDeleteFolder()

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

    const handleRename = async (event) => {
        event.preventDefault()

        if (!newName.trim() || newName === folder.name){
            setIsRenaming(false)
            setNewName(folder.name)
            return
        }

        const result = await updateFolder(folder.id, newName.trim())

        if (result){
            setIsRenaming(false)
            if (onFolderUpdate) onFolderUpdate()
        } else {
            setNewName(folder.name)
        }
    }

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${folder.name}"? This cannot be undone.`)){
            return
        }

        setIsDeleting(true)
        const result = await deleteFolder(folder.id)

        if (result){
            if (onFolderUpdate) onFolderUpdate()
        }

        setIsDeleting(false)
    }
    
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
    const fileCount = folder._count?.files || 0
    const subfolderCount = folder._count?.subfolders || 0
    const total = fileCount + subfolderCount

    const getItemText = () => {
        if (!folder._count) return ''
        if (total === 0) return 'Empty'
        if (total === 1) return '1 item'
        return `${total} items`
    }

    // Placeholder size until logic implemented on backend
    const size = '0 MB'
    const itemText = getItemText()

if (viewMode === 'list'){
        return (
            <div className={`group relative flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900 rounded-sm transition-all ${isTemp || isDeleting ? 'opacity-60 pointer-events-none' : ''}`}>
                <Link to={`/folder/${folder.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <Folder size={20} className={color} />
                    <div className="flex-1 min-w-0">
                        {isRenaming ? (
                            <form onSubmit={handleRename} onClick={(event) => event.stopPropagation()}>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(event) => setNewName(event.target.value)}
                                    onBlur={handleRename}
                                    autoFocus
                                    className="w-full h-7 px-2 bg-zinc-900 border border-zinc-700 rounded-sm text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                                />
                            </form>
                        ) : (
                            <>
                                <h3 className="text-sm font-medium text-zinc-200 truncate">
                                    {folder.name}
                                </h3>
                                {itemText && (
                                    <p className="text-[10px] text-zinc-500">
                                        {itemText} - {size}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </Link>
                
                {/* Context Menu Button */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            setShowMenu(!showMenu)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 rounded transition-opacity text-zinc-400"
                    >
                        <EllipsisVertical size={14} />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-8 z-50 w-24 bg-zinc-900 border border-zinc-800 rounded-sm shadow-lg py-1">
                            <button
                                onClick={(event) => {
                                    event.stopPropagation()
                                    setShowMenu(false)
                                    setIsRenaming(true)
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                            >
                                <Edit2 size={8} />
                                Rename
                            </button>
                            <button
                                onClick={(event) => {
                                    event.stopPropagation()
                                    setShowMenu(false)
                                    handleDelete()
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                            >
                                <Trash2 size={8} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={`group relative p-3 bg-zinc-900/30 border border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg rounded-sm transition-all duration-200 ${!isRenaming && 'hover:-translate-y-0.5'} ${isTemp || isDeleting ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="flex items-start justify-between mb-3">
                <Folder size={20} className={color} />
                
                {/* Context Menu Button */}
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            setShowMenu(!showMenu)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-800 rounded transition-opacity text-zinc-400 z-10"
                    >
                        <EllipsisVertical size={14} />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 top-8 z-50 w-36 bg-zinc-900 border border-zinc-800 rounded-sm shadow-lg py-1">
                            <button
                                onClick={(event) => {
                                    event.stopPropagation()
                                    setShowMenu(false)
                                    setIsRenaming(true)
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
                            >
                                <Edit2 size={14} />
                                Rename
                            </button>
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

            {isRenaming ? (
                <form onSubmit={handleRename} onClick={(event) => event.stopPropagation()}>
                    <input
                        type="text"
                        value={newName}
                        onChange={(event) => setNewName(event.target.value)}
                        onBlur={handleRename}
                        autoFocus
                        className="w-full h-8 px-2 bg-zinc-900 border border-zinc-700 rounded-sm text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    />
                </form>
            ) : (
                <Link to={`/folder/${folder.id}`}>
                    <div className="space-y-0.5 cursor-pointer">
                        <h3 className="text-sm font-medium text-zinc-200 truncate">
                            {folder.name}
                        </h3>
                        {itemText && (
                            <p className="text-[10px] text-zinc-500">
                                {getItemText()} · {size}
                            </p>
                        )}
                    </div>
                </Link>
            )}

            {isTemp && (
                <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
            )}
        </div>
    )
}