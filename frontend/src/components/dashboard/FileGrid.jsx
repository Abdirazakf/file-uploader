import { Link } from "react-router"
import { useFetchAllFiles, useFiles, useFileStoreLoading } from "../../states/useFileStore"
import FileCard from './FileCard'
import { useEffect, useState } from "react"

export default function FileGrid({ limit, viewAll = false, customFiles = null, title = null, showCount = false }) {
    const [selectedFile, setSelectedFile] = useState(null)
    const storeFiles = useFiles()
    const loading = useFileStoreLoading()
    const fetchAllFiles = useFetchAllFiles()

    const allFiles = customFiles !== null ? customFiles : storeFiles

    useEffect(() => {
        if (customFiles === null){
            fetchAllFiles()
        }
    }, [fetchAllFiles, customFiles])

    const files = limit 
        ? allFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, limit)
        : allFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    const getGridClasses = () => {
        // Mobile: 1 col, Tablet: 2-3 cols, Desktop: 4-5 cols
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8'
    }

    const handleFileUpdate = async () => {
        await fetchAllFiles(true)
    }

    const handleFileClick = (file) => {
        setSelectedFile(file)
        console.log(file.originalName)
    }

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-zinc-200 tracking-tight">
                        {title}
                    </h2>
                    <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse"></div>
                </div>
                <div className={getGridClasses(6)}>
                    {[...Array(6)].map((_, i) => (
                        <FileCard key={i} loading />
                    ))}
                </div>
            </div>
        )
    }

    if (files.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                    <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-sm font-medium text-zinc-300 mb-1">No files yet</h3>
                <p className="text-xs text-zinc-500 max-w-sm">
                    Upload your first file to get started
                </p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-zinc-200 tracking-tight">
                    {title}
                </h2>
                {showCount && (
                    <p className="text-sm text-zinc-500">
                        {files.length} {files.length === 1 ? 'file' : 'files'} total
                    </p>
                )}
                {viewAll && allFiles.length > (limit || 0) && (
                    <Link to={'/all-files'} className="cursor-pointer text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        View all
                    </Link>
                )}
            </div>
            <div className={getGridClasses(files.length)}>
                {files.map((file) => (
                    <FileCard
                        key={file.id}
                        file={file}
                        onFileUpdate={handleFileUpdate}
                        onFileClick={handleFileClick}
                    />
                ))}
            </div>
        </div>
    )
}