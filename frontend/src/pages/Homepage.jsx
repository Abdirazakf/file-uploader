import { useAuthStore } from '../states/useAuthStore'
import GuestHome from './GuestHome'
import Dashboard from './Dashboard'
import { ThreeDot } from 'react-loading-indicators'

export default function Homepage(){
    const {auth, loading} = useAuthStore()

    if (loading){
        return (
            <div className="flex items-center justify-center min-h-screen">
                <ThreeDot color='white' size='medium' />
            </div>
        )
    } else if (auth){
        return <Dashboard />
    } else {
        return <GuestHome />
    }
}