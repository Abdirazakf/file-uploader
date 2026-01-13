import { create } from "zustand"
import { showErrorToast, showSuccessToast } from "../components/Toast"

const API = import.meta.env.VITE_NODE_ENV === 'prod' ? '/api' : 'http://localhost:3000/api'

export const useFileStore = create((set, get) => ({
    files: [],
    currentFile: null,
    loading: false,
    uploading: false,
    uploadProgress: 0,
    error: null,
    lastFetch: null,

    uploadFile: async (file, folderId = null) => {
        set({ uploading: true, uploadProgress: 0 })

        try {
            const formData = new FormData()
            formData.append('file', file)
            
            if (folderId) {
                formData.append('folderId', folderId)
            }

            const response = await fetch(`${API}/files`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })

            const results = await response.json()

            if (response.ok) {
                set({ uploading: false, uploadProgress: 100 })
                showSuccessToast(`${file.name} uploaded successfully`)
                return results.file
            } else {
                set({ uploading: false, uploadProgress: 0 })
                results.errors?.forEach(err => showErrorToast(err.msg))
                return null
            }
        } catch {
            set({ uploading: false, uploadProgress: 0 })
            showErrorToast(`Failed to upload ${file.name}`)
            return null
        }
    },

    uploadMultipleFiles: async (files, folderId = null) => {
        set({ uploading: true })
        
        const uploadPromises = files.map(file => get().uploadFile(file, folderId))
        const results = await Promise.all(uploadPromises)
        
        set({ uploading: false })
        
        const successCount = results.filter(r => r !== null).length
        const failCount = results.length - successCount
        
        if (successCount > 1) {
            showSuccessToast(`${successCount} file(s) uploaded successfully`)
        }
        if (failCount > 0) {
            showErrorToast(`${failCount} file(s) failed to upload`)
        }
        
        return results
    },

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

    deleteFile: async (fileId) => {
        try {
            const response = await fetch(`${API}/files/${fileId}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            const results = await response.json()

            if (response.ok) {
                showSuccessToast('File deleted successfully')
                return true
            } else {
                results.errors?.forEach(err => showErrorToast(err.msg))
                return false
            }
        } catch {
            showErrorToast('Failed to delete file')
            return false
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
        uploading: false,
        uploadProgress: 0,
        error: null,
        lastFetch: null
    })
}))

// Selectors for performance optimization
export const useFiles = () => useFileStore(state => state.files)
export const useCurrentFile = () => useFileStore(state => state.currentFile)
export const useFileStoreLoading = () => useFileStore(state => state.loading)
export const useFileUploading = () => useFileStore(state => state.uploading)
export const useUploadProgress = () => useFileStore(state => state.uploadProgress)
export const useFileStoreError = () => useFileStore(state => state.error)

// Action selectors (don't cause re-renders)
export const useUploadFile = () => useFileStore(state => state.uploadFile)
export const useUploadMultipleFiles = () => useFileStore(state => state.uploadMultipleFiles)
export const useFetchFileById = () => useFileStore(state => state.fetchFileById)
export const useFetchAllFiles = () => useFileStore(state => state.fetchAllFiles)
export const useDeleteFile = () => useFileStore(state => state.deleteFile)
export const useClearCurrentFile = () => useFileStore(state => state.clearCurrentFile)
export const useRefreshFiles = () => useFileStore(state => state.refresh)
export const useResetFileStore = () => useFileStore(state => state.reset)