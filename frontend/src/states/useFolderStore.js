import { create } from 'zustand'
import { showErrorToast, showSuccessToast } from '../components/Toast'

const API = import.meta.env.VITE_NODE_ENV === 'prod' ? '/api' : 'http://localhost:3000/api'

export const useFolderStore = create((set, get) => ({
    folders: [],
    currentFolder: null,
    loading: false,
    error: null,
    lastFetch: null,

    fetchFolders: async (force = false) => {
        const { lastFetch } = get()

        // Cache for 30 sec or skip if recently fetch
        if (!force && lastFetch && Date.now() - lastFetch < 30000){
            return
        }

        set({ loading: true, error: null})

        try {
            const response = await fetch(`${API}/folders`, {
                method: 'GET',
                credentials: 'include'
            })

            const results = await response.json()

            if (response.ok){
                set({
                    folders: results.folders,
                    loading: false,
                    lastFetch: Date.now()
                })
            }
        } catch {
            set({ error: 'Failed to load folders', loading: false})
            showErrorToast('Failed to load folders')
        }
    },

    fetchFolderById: async (folderId) => {
        set({ loading: true, error: null, currentFolder: null})

        try {
            const response = await fetch(`${API}/folders/${folderId}`, {
                method: 'GET',
                credentials: 'include'
            })

            const results = await response.json()

            if (response.ok){
                set({ currentFolder: results.folder, loading: false})
                return results.folder
            } else {
                set({ error: 'Folder not found', loading: false })
                showErrorToast('Folder not found')
                return null
            }
        } catch {
            set({ error: 'Folder not found', loading: false })
            showErrorToast('Folder not found')
            return null
        }
    },

    clearCurrentFolder: () => set({ currentFolder: null }),

    createFolder: async (name, parentId = null) => {
        const tempId = `temp-${Date.now()}`
        const tempFolder = {
            id: tempId,
            name,
            parentId,
            subfolders: [],
            createdAt: new Date().toISOString()
        }

        if (!parentId) {
            set(state => ({
                folders: [...state.folders, tempFolder]
            }))
        }

        try {
            const body = { name }
            if (parentId) {
                body.parentId = parentId
            }

            const response = await fetch(`${API}/folders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(body)
            })

            const results = await response.json()

            if (response.ok){
                // Only update folders array if it's a root folder
                if (!parentId) {
                    set(state => ({
                        folders: state.folders.map(f => f.id === tempId ? results.folder : f),
                        lastFetch: Date.now()
                    }))
                }
                showSuccessToast('Folder created successfully')
                return results.folder
            } else {
                // Remove temp folder on error
                if (!parentId) {
                    set(state => ({
                        folders: state.folders.filter(f => f.id !== tempId)
                    }))
                }

                results.errors?.forEach(err => showErrorToast(err.msg))
                return null
            }
        } catch {
            // Remove temp folder on error
            if (!parentId) {
                set(state => ({
                    folders: state.folders.filter(f => f.id !== tempId)
                }))
            }
            showErrorToast('Failed to create folder')
            return null
        }
    },

    updateFolder: async (folderId, newName) => {
        // Store old folders for rollback
        const oldFolders = get().folders

        set(state => ({
            folders: state.folders.map(f => f.id === folderId ? {...f, name: newName} : f)
        }))

        try {
            const response = await fetch(`${API}/folders/${folderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ name: newName })
            })

            const results = await response.json()

            if (response.ok) {
                // Update with server response
                set(state => ({
                    folders: state.folders.map(f => 
                        f.id === folderId ? results.folder : f
                    ),
                    lastFetch: Date.now()
                }))
                showSuccessToast('Folder updated successfully')
                return results.folder
            } else {
                // Rollback on error
                set({ folders: oldFolders})

                results.errors?.forEach(err => showErrorToast(err.msg))
                return null
            }
        } catch {
                set({ folders: oldFolders})
                showErrorToast('Failed to update folder')
                return null
        }
    },

    deleteFolder: async (folderId) => {
        // Store old folders for rollback
        const oldFolders = get().folders

        set(state => ({
            folders: state.folders.filter(f => f.id !== folderId)
        }))

        try {
            const response = await fetch(`${API}/folders/${folderId}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            const results = await response.json()

            if (response.ok) {
                set({ lastFetch: Date.now() })
                showSuccessToast('Folder deleted successfully')
                return true
            } else {
                // Rollback on error
                set({ folders: oldFolders })
                results.errors?.forEach(err => showErrorToast(err.msg))
                return false
            }
        } catch {
            set({ folders: oldFolders })
            showErrorToast('Failed to delete folder')
            return false
        }
    },

    // Force refresh
    refresh: async () => {
        await get().fetchFolders(true)
    },

    refreshIndividual: async (folderId) => {
        await get().fetchFolderById(folderId)
    },

    // Reset store (on logout)
    reset: () => set({
        folders: [],
        currentFolder: null,
        loading: false,
        error: null,
        lastFetch: null
    })
}))

// Selectors for performance optimization
export const useFolders = () => useFolderStore(state => state.folders)
export const useCurrentFolder = () => useFolderStore(state => state.currentFolder)
export const useFolderStoreLoading = () => useFolderStore(state => state.loading)
export const useFolderStoreError = () => useFolderStore(state => state.error)

// Actions selectors that don't cause re-renders)
export const useFetchFolders = () => useFolderStore(state => state.fetchFolders)
export const useFetchFolderById = () => useFolderStore(state => state.fetchFolderById)
export const useCreateFolder = () => useFolderStore(state => state.createFolder)
export const useUpdateFolder = () => useFolderStore(state => state.updateFolder)
export const useDeleteFolder = () => useFolderStore(state => state.deleteFolder)
export const useClearCurrentFolder = () => useFolderStore(state => state.clearCurrentFolder)
export const useRefreshFolders = () => useFolderStore(state => state.refresh)
export const useRefreshFolder = () => useFolderStore(state => state.refreshIndividual)
export const useResetFolderStore = () => useFolderStore(state => state.reset)