import LeftSidebar from '../components/LeftSidebar'
import FolderGrid from '../components/dashboard/FolderGrid'
import { Plus } from 'lucide-react'

export default function AllFolders(){
    const handleCreate = () => {
        console.log('Create folder button clicked')
    }
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background">
            <LeftSidebar />
            
            <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
                <header className="h-14 border-b border-border flex items-center justify-end px-6 bg-background/95 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-3">
                        <button
                        onClick={handleCreate}
                        className="cursor-pointer hidden sm:flex items-center gap-2 bg-zinc-100 hover:bg-white text-black px-3 py-1.5 rounded-sm text-sm font-medium transition-colors"
                        >
                            <Plus size={14} />
                            <span>Create</span>
                        </button>
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto p-6 relative">
                    <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"/>
                    <FolderGrid />
                </div>
            </main>
        </div>
    )
}