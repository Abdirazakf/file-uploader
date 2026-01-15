import { useState } from 'react'
import LeftSidebar from '../components/LeftSidebar'
import MainHeader from '../components/MainHeader'
import { useRefetchOnFocus } from '../hooks/useRefetchOnFocus'
import FileUpload from '../components/dashboard/FileUpload'
import FolderGrid from '../components/dashboard/FolderGrid'
import FileGrid from '../components/dashboard/FileGrid'
import { useFetchAllFiles } from '../states/useFileStore'
import RightSidebar from '../components/RightSidebar'

export default function Dashboard(){
    const [viewMode, setViewMode] = useState('grid')
    const [selectedFile, setSelectedFile] = useState(null)
    const fetchAllFiles = useFetchAllFiles()

    useRefetchOnFocus()

    const handleFileDrop = async () => {        
        await fetchAllFiles(true)
    }

    const handleFileClick = (file) => {
        setSelectedFile(file)
    }

    const handleCloseSidebar = () => {
        setSelectedFile(null)
    }

    const handleFileUpdate = async () => {
        await fetchAllFiles(true)
    }

    return (
        <div className="fixed inset-0 flex bg-background md:static md:h-screen">
            <LeftSidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col w-full md:w-auto">
                <MainHeader
                    breadcrumbs={[
                        { name: 'Home', path: '/' }
                    ]}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />

                <div className="flex-1 overflow-y-auto p-6 pb-20 md:pb-6">
                    <div className="relative">
                        <FileUpload onUpload={handleFileDrop}/>

                        <FolderGrid viewMode={viewMode} viewAll/>

                        <FileGrid limit={6} viewAll onFileClick={handleFileClick}/>
                    </div>
                </div>
            </div>

            {selectedFile && (
                <RightSidebar file={selectedFile} onClose={handleCloseSidebar} onFileUpdate={handleFileUpdate} />
            )}
        </div>
    )
}