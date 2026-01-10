import Navbar from "../components/Navbar"
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import Footer from "../components/Footer"

export default function GuestHome(){
    return (
        <div className="flex flex-col overflow-y-auto relative h-screen">
            {/* Grid Background */}
            <div className="fixed inset-0 bg-grid opacity-[0.04] pointer-events-none z-0"></div>
            <div className="fixed inset-0 bg-linear-to-b from-transparent via-background/50 to-background pointer-events-none z-0"></div>

            <Navbar />

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-20 pb-32 px-6 text-center">
                <h1 className="animate-enter opacity-0 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white via-white to-zinc-500 mb-6 w-full mx-auto text-center leading-tight" style={{animationDelay: '0.2s'}}>
                    Storage for the <br className="hidden md:block"/> modern web.
                </h1>
                
                <p className="animate-enter opacity-0 text-lg text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed" style={{animationDelay: '0.3s'}}>
                    Secure storage designed for everyday use. High performance, 
                    global replication, and seamless integration with your workflow.
                </p>
                
                <div className="animate-enter opacity-0 flex flex-col sm:flex-row items-center gap-3 justify-center mb-20" style={{animationDelay: '0.4s'}}>
                    <Link to="/sign-up">
                        <button className="cursor-pointer h-10 px-6 bg-zinc-100 hover:bg-white text-black font-medium rounded-sm transition-all hover:scale-105 flex items-center gap-2">
                            Start Building
                            <ArrowRight size={16} />
                        </button>
                    </Link>
                </div>

                {/* Dashboard Preview Graphic */}
                <div className="animate-enter opacity-0 relative max-w-5xl mx-auto w-full aspect-video rounded-lg border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm overflow-hidden shadow-2xl shadow-blue-900/10" style={{animationDelay: '0.5s'}}>
                    <div className="absolute inset-0 bg-linear-to-tr from-zinc-900/80 via-transparent to-transparent z-10"></div>
                    <div className="absolute inset-0 p-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-700 ease-in-out">
                        <div className="flex h-full gap-4">
                            <div className="w-48 h-full border-r border-zinc-800/50"></div>
                            <div className="flex-1 space-y-4">
                                <div className="h-8 w-full border-b border-zinc-800/50"></div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="aspect-video bg-zinc-800/20 rounded border border-zinc-800/30"></div>
                                    <div className="aspect-video bg-zinc-800/20 rounded border border-zinc-800/30"></div>
                                    <div className="aspect-video bg-zinc-800/20 rounded border border-zinc-800/30"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Overlay CTA */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <Link to="/login">
                            <button className="cursor-pointer px-4 py-2 bg-blue-600/10 border border-blue-500/50 text-blue-400 rounded-full text-xs font-medium backdrop-blur-md hover:bg-blue-600 hover:text-white transition-all">
                                Start Storing Today
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}