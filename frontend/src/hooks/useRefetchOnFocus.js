import { useEffect } from 'react'
import { useFolderStore } from '../states/useFolderStore'

/**
 * Hook to automatically refetch folders when user returns to tab
 * This makes sure data stays fresh
 */

export function useRefetchOnFocus(){
    const fetchFolders = useFolderStore(state => state.fetchFolders)

    useEffect(() =>{
        const handleVisibilityChange = () => {
            // Refetch when tab becomes visible
            if (document.visibilityState === 'visible'){
                fetchFolders(true)
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [fetchFolders])
}