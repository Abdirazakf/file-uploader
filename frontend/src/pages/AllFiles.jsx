import { useEffect } from "react"
import FileCard from "../components/dashboard/FileCard"
import LeftSidebar from "../components/LeftSidebar"
import MainHeader from "../components/MainHeader"
import { useFiles, useFileStoreLoading, useFetchAllFiles } from "../states/useFileStore"
import { File } from "lucide-react"

export default function AllFiles() {
    const files = useFiles()
    const loading = useFileStoreLoading()
    const fetchAllFiles = useFetchAllFiles()

    // Fetch files on mount
    useEffect(() => {
        fetchAllFiles()
    }, [fetchAllFiles])

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background">
            <LeftSidebar />

            <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
                {/* Header */}
                <MainHeader />

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 relative">
                    <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>

                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight mb-1">
                            All Files
                        </h1>
                        <p className="text-xs text-zinc-500">
                            View and manage all your uploaded files
                        </p>
                    </div>

                    {loading ? (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-zinc-200 tracking-tight">
                                    Files
                                </h2>
                                <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {[...Array(10)].map((_, i) => (
                                    <FileCard key={i} loading />
                                ))}
                            </div>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                                <File />
                            </div>
                            <h3 className="text-sm font-medium text-zinc-300 mb-1">No files yet</h3>
                            <p className="text-xs text-zinc-500 max-w-sm">
                                Upload your first file to get started
                            </p>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-semibold text-zinc-200 tracking-tight">
                                    Files
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {files.map((file) => (
                                    <FileCard key={file.id} file={file} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}