import { Link } from "react-router";
import { useFolders, useFolderStoreLoading } from "../../states/useFolderStore";
import FolderCard from './FolderCard'

export default function FolderGrid({ viewMode = 'grid' }){
    const folders = useFolders()
    const loading = useFolderStoreLoading()

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-zinc-200 tracking-tight">
                        Folders
                    </h2>
                    <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse"></div>
                </div>

                <div className={
                    viewMode === 'grid' 
                        ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8'
                        : 'flex flex-col gap-2 mb-8'
                }>
                    {/* Show 5 skeleton cards */}
                    {[...Array(5)].map((_, i) => (
                        <FolderCard key={i} loading viewMode={viewMode} />
                    ))}
                </div>
            </div>
        )
    }

    if (folders.length === 0){
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                    <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                </div>
                <h3 className="text-sm font-medium text-zinc-300 mb-1">No folders yet</h3>
                <p className="text-xs text-zinc-500 max-w-sm">
                    Create your first folder to organize your files
                </p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-zinc-200 tracking-tight">
                    Folders
                </h2>
                <Link to={'/folders/all'} className="cursor-pointer text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    View all
                </Link>
            </div>

            <div className={
                viewMode === 'grid' 
                    ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8'
                    : 'flex flex-col gap-2 mb-8'
            }>
                {folders.map((folder, index) => (
                    <FolderCard
                        key={folder.id}
                        folder={folder}
                        index={index}
                        viewMode={viewMode}
                    />
                ))}
            </div>
        </div>
    )
}