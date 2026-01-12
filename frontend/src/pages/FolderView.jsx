import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { useFetchFolderById, useCurrentFolder, useFolderStoreLoading } from '../states/useFolderStore'
import LeftSideBar from '../components/dashboard/LeftSidebar'
import FolderCard from '../components/dashboard/FolderCard'
import FileCard from '../components/dashboard/FileCard'
import MainHeader from '../components/dashboard/MainHeader'
import { FOLDER_COLORS } from '../constants/colorPalettes.js'
import { formatDate, formatPath } from '../utils/formatData.js'
import { Plus, Folder } from 'lucide-react'

function FolderViewSkeleton(){
    return (
        <div className="flex-1 overflow-y-auto p-6 relative">
            <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>
            
            {/* Header skeleton */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse"></div>
                        <div className="h-3 w-64 bg-zinc-800/50 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Subfolders skeleton */}
            <div className="mb-6">
                <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse mb-3"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {[...Array(3)].map((_,i) => (
                        <FolderCard key={i} loading />
                    ))}
                </div>
            </div>

            {/* Files skeleton */}
            <div>
                <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse mb-3"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <FileCard key={i} loading />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function FolderView(){
    const { folderId } = useParams()
    const fetchFolderById = useFetchFolderById()
    const currentFolder = useCurrentFolder()
    const loading = useFolderStoreLoading()

    useEffect(() => {
        if (folderId){
            fetchFolderById(folderId)
        }
    }, [folderId, fetchFolderById])

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('Uploaded file')
    }
    
    const breadcrumbs = formatPath(currentFolder)

    const folderActions = (
        <>
            <button 
                onClick={handleSubmit}
                className="hidden sm:flex items-center gap-2 bg-zinc-100 hover:bg-white text-black px-3 py-1.5 rounded-sm text-sm font-medium transition-colors"
            >
                <Plus size={14} />
                <span>New</span>
            </button>
        </>
    )

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background">
            <LeftSideBar />

            <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
                <MainHeader
                    breadcrumbs={loading ? [{ name: 'Home', path: '/'}] : breadcrumbs}
                    actions={folderActions}
                />

                {loading ? (
                    <FolderViewSkeleton />
                ) : !currentFolder ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800 mx-auto">
                                <Folder className="w-8 h-8 text-zinc-600" />
                            </div>
                            <h3 className="text-sm font-medium text-zinc-300 mb-1">Folder not found</h3>
                            <p className="text-xs text-zinc-500 mb-4">
                                This folder may have been deleted or you don't have access
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 relative">
                        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>

                        {/* Folder Header Info */}
                        <div className="mb-8 flex items-end justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`w-10 h-10 border rounded-lg flex items-center justify-center`}>
                                        <Folder size={20} />
                                    </div>
                                    <div className='space-y-0.5'>
                                        <h1 className="text-xl font-semibold text-zinc-100 tracking-tight leading-tight" style={{marginBottom: '5px'}}>
                                            {currentFolder.name}
                                        </h1>
                                        <p className="text-xs text-zinc-500">
                                            Updated {formatDate(currentFolder.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subfolders Section */}
                        {currentFolder.subfolders && currentFolder.subfolders.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                                    Subfolders ({currentFolder.subfolders.length})
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {currentFolder.subfolders.map((subfolder, index) => (
                                        <FolderCard 
                                            key={subfolder.id} 
                                            folder={subfolder} 
                                            index={index}
                                            viewMode="grid"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Files Section */}
                        <div>
                            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                                Files ({currentFolder._count?.files || 0})
                            </h3>
                            
                            {currentFolder.files && currentFolder.files.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {currentFolder.files.map((file) => (
                                        <FileCard key={file.id} file={file} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-zinc-800 rounded-lg">
                                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                                        <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-medium text-zinc-300 mb-1">No files yet</h3>
                                    <p className="text-xs text-zinc-500 max-w-sm mb-4">
                                        Upload your first file to this folder
                                    </p>
                                    <button 
                                        onClick={handleSubmit}
                                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-sm transition-colors"
                                    >
                                        Upload File
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}