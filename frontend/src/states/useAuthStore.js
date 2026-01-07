import {create} from 'zustand'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:3000'

export const useAuthStore = create ((set) => ({
    user: null,
    auth: false,
    loading: true,

    checkAuth: async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/status`, {
                method: 'GET',
                credentials: 'include'
            })
            
            const results = await response.json()

            set({
                user: results.user,
                auth: results.auth,
                loading: false
            })
        } catch (err){
            toast.error('You are not logged in')
            console.error('Auth check failed:', err)

            set({
                user: null,
                auth: false,
                loading: false
            })
        }
    },

    setUser: (user) => set({
        user,
        auth: true
    }),

    logoutUser: async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })

            set({
                user: null,
                auth: false
            })
        } catch (err){
            toast.error('Failed to logout')
            console.error('Logout failed:', err)
        }
    }
}))