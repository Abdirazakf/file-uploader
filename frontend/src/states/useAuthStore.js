import {create} from 'zustand'
import { showErrorToast, showSuccessToast } from "../components/Toast";

const API = import.meta.env.VITE_NODE_ENV === 'prod' ? '/api' : 'http://localhost:3000/api'

export const useAuthStore = create ((set) => ({
    user: null,
    auth: false,
    loading: true,

    checkAuth: async () => {
        try {
            const response = await fetch(`${API}/auth/status`, {
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
            showErrorToast('You are not logged in')
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
            await fetch(`${API}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })

            set({
                user: null,
                auth: false
            })

            const { useFolderStore } = await import('./useFolderStore')
            useFolderStore.getState().reset()

            showSuccessToast('Logged out successfully')
        } catch (err){
            showErrorToast('Failed to logout')
            console.error('Logout failed:', err)
        }
    }
}))