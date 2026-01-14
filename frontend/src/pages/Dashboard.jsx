import { useState } from 'react'
import LeftSidebar from '../components/LeftSidebar'
import MainHeader from '../components/MainHeader'
import { useRefetchOnFocus } from '../hooks/useRefetchOnFocus'
import FileUpload from '../components/dashboard/FileUpload'
import FolderGrid from '../components/dashboard/FolderGrid'
import FileGrid from '../components/dashboard/FileGrid'
import { useFetchAllFiles } from '../states/useFileStore'

export default function Dashboard(){
    const [viewMode, setViewMode] = useState('grid')
    const fetchAllFiles = useFetchAllFiles()

    useRefetchOnFocus()

    const handleUploadClick = () => {
        console.log('Test: upload click working')
    }

    const handleFileDrop = async () => {        
        await fetchAllFiles(true)
    }

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background">
            <LeftSidebar />

            {/* Main content area */}
            <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
                <MainHeader
                    breadcrumbs={[
                        { name: 'Home', path: '/' }
                    ]}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onUploadClick={handleUploadClick}
                />

                <div className="flex-1 overflow-y-auto p-6 relative">
                    <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"/>

                    <FileUpload onUpload={handleFileDrop}/>

                    <FolderGrid viewMode={viewMode} viewAll/>

                    <FileGrid limit={6} viewAll/>
                </div>
            </main>

            {/* Right sidebar (details panel) */}
        </div>
    )
}