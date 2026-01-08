import { useEffect } from 'react'
import {useAuthStore} from './states/useAuthStore'
import {Routes, Route} from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import GuestRoute from './components/GuestRoute'
import Homepage from './pages/Homepage'
import SignUp from './pages/SignUp'
import Login from './pages/Login'

export default function App(){
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className="min-h-screen bg-background text-zinc-400 font-sans antialiased h-screen w-screen overflow-hidden selection:bg-white/10">
      <Routes>
        <Route path='/' element={<Homepage/>} />

        <Route path='/sign-up'
        element={
          <GuestRoute>
            <SignUp />
          </GuestRoute>
        } />

        <Route path='/login'
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />

      </Routes>

      <Toaster />
    </div>
  )
}