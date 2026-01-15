import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useFetchFolderById, useCurrentFolder, useFolderStoreLoading, useCreateFolder } from '../states/useFolderStore'
import LeftSideBar from '../components/LeftSidebar'
import FolderCard from '../components/dashboard/FolderCard'
import MainHeader from '../components/MainHeader'
import { formatDate, formatPath } from '../utils/formatData.js'
import { Plus, Folder, FolderPlus, File } from 'lucide-react'
import { ThreeDot } from 'react-loading-indicators'
import FileGrid from '../components/dashboard/FileGrid.jsx'
import { useUploadMultipleFiles } from '../states/useFileStore.js'

export default function FolderView(){
    const { folderId } = useParams()
    const fetchFolderById = useFetchFolderById()
    const currentFolder = useCurrentFolder()
    const loading = useFolderStoreLoading()
    const createFolder = useCreateFolder()
    const uploadFiles = useUploadMultipleFiles()

    const [selectedFile, setSelectedFile] = useState(null)
    const [showNewInput, setShowNewInput] = useState(false)
    const [newFolderName, setNewFolderName] = useState('')
    const [creating, setCreating] = useState(false)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if (folderId){
            fetchFolderById(folderId)
        }
    }, [folderId, fetchFolderById])

    const handleUpload = () => {
        fileInputRef.current?.click()
    }

    const handleFileSelect = async (e) => {
        const selectedFile = Array.from(e.target.files || [])
        
        if (selectedFile.length > 0) {
            await uploadFiles(selectedFile, folderId)

            await fetchFolderById(folderId)
            
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleCreateFolder = async (event) => {
        event.preventDefault()

        if (!newFolderName.trim()) return

        setCreating(true)

        const result = await createFolder(newFolderName.trim(), folderId)

        if (result){
            await fetchFolderById(folderId)
            setNewFolderName('')
            setShowNewInput(false)
        }

        setCreating(false)
    }

    const handleFolderUpdate = async () => {
        await fetchFolderById(folderId)
    }

    const handleFileClick = (file) => {
        setSelectedFile(file)
    }

    const handleCloseSidebar = () => {
        setSelectedFile(null)
    }
    
    const breadcrumbs = formatPath(currentFolder)

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background">
            <LeftSideBar />

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
            />

            <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
                <MainHeader
                    breadcrumbs={loading ? [{ name: 'Home', path: '/'}] : breadcrumbs}
                    setUpload
                    onUploadClick={handleUpload}
                />

                {loading ? (
                    <div className='h-full flex-1 flex items-center justify-center'>
                        <ThreeDot size='medium' color={'white'}/>
                    </div>
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
                                    <div className="w-10 h-10 border border-zinc-800 rounded-lg flex items-center justify-center">
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
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                    Subfolders ({currentFolder.subfolders?.length || 0})
                                </h3>
                                {!showNewInput && (
                                    <button
                                        onClick={() => setShowNewInput(true)}
                                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
                                    >
                                        <Plus size={12} />
                                        New Folder
                                    </button>
                                )}
                            </div>

                            {/* New Folder Input */}
                            {showNewInput && (
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
                                                setShowNewInput(false)
                                                setNewFolderName('')
                                            }}
                                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-sm transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            {currentFolder.subfolders && currentFolder.subfolders.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {currentFolder.subfolders.map((subfolder, index) => (
                                        <FolderCard 
                                            key={subfolder.id} 
                                            folder={subfolder} 
                                            index={index}
                                            viewMode="grid"
                                            onFolderUpdate={handleFolderUpdate}
                                        />
                                    ))}
                                </div>
                            ) : !showNewInput && (
                                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-zinc-800 rounded-lg">
                                    <Folder className="w-12 h-12 text-zinc-600 mb-2" />
                                    <p className="text-xs text-zinc-500">No subfolders yet</p>
                                    <button
                                        onClick={() => setShowNewInput(true)}
                                        className="mt-3 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-sm transition-colors"
                                    >
                                        Create Folder
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Files Section */}
                        <div>
                            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                                Files ({currentFolder._count?.files || 0})
                            </h3>
                            
                            {currentFolder.files && currentFolder.files.length > 0 ? (
                                <FileGrid viewAll customFiles={currentFolder.files} onFileDelete={handleFolderUpdate} />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-zinc-800 rounded-lg">
                                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                                        <File />
                                    </div>
                                    <h3 className="text-sm font-medium text-zinc-300 mb-1">No files yet</h3>
                                    <p className="text-xs text-zinc-500 max-w-sm mb-4">
                                        Upload your first file to this folder
                                    </p>
                                    <button 
                                        onClick={handleUpload}
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