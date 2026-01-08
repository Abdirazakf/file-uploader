import { useState } from "react";
import { useAuthStore } from "../states/useAuthStore";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { ThreeDot } from "react-loading-indicators";
import { CircleArrowLeft, Box, EyeOff, Eye } from "lucide-react";
import toast from 'react-hot-toast'

export default function Login(){
    const setUser = useAuthStore((state) => state.setUser)
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.target)

        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        }

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            const results = await response.json()

            if (!response.ok){
                if (results.error){
                    results.errors.forEach(err => {
                        toast.error(err.msg)
                    })
                } else {
                    toast.error('Login Failed. Please try again')
                }
            } else {
                setUser(results.user)
                toast.success('Login Successful')
                setTimeout(() => navigate('/'), 500)
            }
        } catch {
            toast.error('Something went wrong. Please try again')
        } finally {
            setLoading(false)
        }
    }

return(
        <div className="view-section h-full relative flex items-center justify-center bg-background">
            <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>

            <Link to='/'>
                <button className="cursor-pointer absolute top-6 left-6 flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
                    <CircleArrowLeft className="text-zinc-100"/>
                    Back
                </button>
            </Link>

            <div className="w-full max-w-87.5 mx-auto p-6 z-10 animate-enter">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center shadow-sm">
                        <Box className="w-5 h-5 text-zinc-100"/>
                    </div>
                    <h1 className="text-xl font-semibold text-zinc-100 tracking-tight mb-1">Welcome Back</h1>
                    <p className="text-sm text-zinc-500">Enter your email and password to sign into your account.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-semibold text-zinc-300">
                            Email
                        </label>
                        <input type="email"
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            autoCapitalize="off"
                            spellCheck="false"
                            className="w-full h-10 px-3 bg-zinc-900/50 border border-zinc-800 rounded-sm text-sm
                            text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-semibold text-zinc-300">
                            Password
                        </label>
                        <div className="relative">
                            <input type={showPass ? "text" : "password"}
                                id="password"
                                name="password"
                                autoCapitalize="off"
                                spellCheck="false"
                                className="w-full h-10 px-3 pr-10 bg-zinc-900/50 border border-zinc-800 rounded-sm text-sm
                                text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 transition-all"
                                required
                            />

                            <button type="button" onClick={() => setShowPass(!showPass)} className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <button className="cursor-pointer w-full h-10 bg-zinc-100 hover:bg-white text-black text-sm font-medium rounded-sm transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        {loading ? <ThreeDot color={"white"} size="small" /> : <span>Login</span>}
                    </button>
                </form>
                <p className="mt-4 text-center text-xs text-zinc-500">
                    Don't have an account?
                    <Link to="/sign-up" className="text-zinc-300 hover:underline underline-offset-4 ml-1">Sign up</Link>
                </p>
            </div>
        </div>
    )
}