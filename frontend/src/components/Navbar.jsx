import { Box } from 'lucide-react'
import { Link } from 'react-router'

export default function Navbar(){
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-100 font-semibold tracking-tight">
                    <div className="w-6 h-6 bg-zinc-100 text-black flex items-center justify-center rounded-[4px]">
                        <Box size={14} />
                    </div>
                    <span>UR FILES</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <button className="cursor-pointer text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                                Log in
                            </button>
                        </Link>
                        <Link to="/sign-up">
                            <button className="cursor-pointer text-sm font-medium bg-zinc-100 hover:bg-white text-black px-3 py-1.5 rounded-[4px] transition-colors">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}