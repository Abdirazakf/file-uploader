import { create } from "zustand"
import { showErrorToast } from "../components/Toast"

const API = import.meta.env.VITE_NODE_ENV === 'prod' ? '/api' : 'http://localhost:3000/api'

export const useFileStore = create((set, get) => ({
    files: [],
    currentFile: null,
    loading: false,
    error: null,
    lastFetch: null,

    fetchFileById: async (fileId) => {
        set({ loading: true, error: null, currentFile: null })

        try {
            const response = await fetch(`${API}/files/${fileId}`, {
                method: 'GET',
                credentials: 'include'
            })

            const results = await response.json()

            if (response.ok) {
                set({ currentFile: results.file, loading: false })
                return results.file
            } else {
                set({ error: 'File not found', loading: false })
                showErrorToast('File not found')
                return null
            }
        } catch {
            set({ error: 'Failed to load file', loading: false })
            showErrorToast('Failed to load file')
            return null
        }
    },

    fetchAllFiles: async (force = false) => {
        const { lastFetch } = get()

        // Cache for 30 sec or skip if recently fetched
        if (!force && lastFetch && Date.now() - lastFetch < 30000) {
            return
        }

        set({ loading: true, error: null })

        try {
            const response = await fetch(`${API}/files/all`, {
                method: 'GET',
                credentials: 'include'
            })

            const results = await response.json()

            if (response.ok) {
                set({
                    files: results.files,
                    loading: false,
                    lastFetch: Date.now()
                })
            } else {
                set({ error: 'Failed to fetch files', loading: false })
                showErrorToast('Failed to fetch files')
            }
        } catch {
            set({ error: 'Failed to fetch files', loading: false })
            showErrorToast('Failed to fetch files')
        }
    },

    clearCurrentFile: () => set({ currentFile: null }),

    // Force refresh
    refresh: async () => {
        await get().fetchAllFiles(true)
    },

    // Reset store (on logout)
    reset: () => set({
        files: [],
        currentFile: null,
        loading: false,
        error: null,
        lastFetch: null
    })
}))

// Selectors for performance optimization
export const useFiles = () => useFileStore(state => state.files)
export const useCurrentFile = () => useFileStore(state => state.currentFile)
export const useFileStoreLoading = () => useFileStore(state => state.loading)
export const useFileStoreError = () => useFileStore(state => state.error)

// Action selectors (don't cause re-renders)
export const useFetchFileById = () => useFileStore(state => state.fetchFileById)
export const useFetchAllFiles = () => useFileStore(state => state.fetchAllFiles)
export const useClearCurrentFile = () => useFileStore(state => state.clearCurrentFile)
export const useRefreshFiles = () => useFileStore(state => state.refresh)
export const useResetFileStore = () => useFileStore(state => state.reset)