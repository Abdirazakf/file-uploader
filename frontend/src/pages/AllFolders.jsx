import LeftSidebar from '../components/dashboard/LeftSidebar'
import MainHeader from '../components/dashboard/MainHeader'
import FolderGrid from '../components/dashboard/FolderGrid'

export default function AllFolders(){
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background">
            <LeftSidebar />
            
            <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
                <MainHeader />
                
                <div className="flex-1 overflow-y-auto p-6 relative">
                    <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"/>
                    <FolderGrid />
                </div>
            </main>
        </div>
    )
}