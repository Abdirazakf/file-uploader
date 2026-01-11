import { useEffect } from 'react'
import { useFolderStore } from '../states/useFolderStore'

/**
 * Hook to automatically refetch folders when user returns to tab
 * This makes sure data stays fresh
 */

export function useRefetchOnFocus(){
    const fetchFolders = useFolderStore(state => state.fetchFolders)

    useEffect(() => {
        const handleFocus = () => {
            // Refetch when window gains focus
            fetchFolders(true) // Bypasses cache
        }

        const handleVisibilityChange = () => {
            // Refetch when tab becomes visible
            if (document.visibilityState === 'visible'){
                fetchFolders(true)
            }
        }

        window.addEventListener('focus', handleFocus)
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            window.removeEventListener('focus', handleFocus)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [fetchFolders])
}