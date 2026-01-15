import { useState } from 'react'
import LeftSidebar from '../components/LeftSidebar'
import FolderGrid from '../components/dashboard/FolderGrid'
import { Plus } from 'lucide-react'
import { useCreateFolder } from '../states/useFolderStore'

export default function AllFolders(){
    const [newFolderName, setNewFolderName] = useState('')
    const [creating, setCreating] = useState(false)
    const [showInput, setShowInput] = useState(false)
    const createFolder = useCreateFolder()

    const handleCreateFolder = async (event) => {
        event.preventDefault()

        if (!newFolderName.trim()) return

        setCreating(true)

        const result = await createFolder(newFolderName.trim(), null)

        if (result){
            setNewFolderName('')
            setShowInput(false)
        }

        setCreating(false)
    }
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background">
            <LeftSidebar />
            
            <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
                <header className="h-14 border-b border-border flex items-center justify-end px-6 bg-background/95 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-3">
                        <button
                        onClick={() => setShowInput(!showInput)}
                        className="cursor-pointer hidden sm:flex items-center gap-2 bg-zinc-100 hover:bg-white text-black px-3 py-1.5 rounded-sm text-sm font-medium transition-colors"
                        disabled={creating}
                        >
                            <Plus size={14} />
                            <span>Create</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 relative">
                    <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"/>
                    {/* New Folder Input */}
                    {showInput && (
                        <form onSubmit={handleCreateFolder} className="mb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="Folder name..."
                                    autoFocus
                                    disabled={creating}
                                    className="flex-1 h-9 px-3 bg-zinc-900/50 border border-zinc-800 rounded-sm text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                                />
                                <button
                                    type="submit"
                                    disabled={creating || !newFolderName.trim()}
                                    className="px-4 py-2 bg-zinc-100 hover:bg-white text-black text-sm font-medium rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {creating? 'Creating...' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowInput(false)
                                        setNewFolderName('')
                                    }}
                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-sm transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                    <FolderGrid />
                </div>
            </main>
        </div>
    )
}