import { useState } from 'react'
import LeftSidebar from '../components/dashboard/LeftSidebar'
import MainHeader from '../components/dashboard/MainHeader'
import { useRefetchOnFocus } from '../hooks/useRefetchOnFocus'

export default function Dashboard(){
    const [viewMode, setViewMode] = useState('grid')

    useRefetchOnFocus()

    const handleUploadClick = () => {
        console.log('Test: upload click working')
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
            </main>

            {/* Right sidebar (details panel) */}
        </div>
    )
}