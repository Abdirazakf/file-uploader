import LeftSidebar from '../components/dashboard/LeftSidebar'

export default function Dashboard(){
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background">
            <LeftSidebar />

            {/* Main content area */}
            <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
                
            </main>

            {/* Right sidebar (details panel) */}
        </div>
    )
}