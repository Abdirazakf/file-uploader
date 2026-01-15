export const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const formatSize = (bytes) => {
    if (!bytes || bytes === '0') return '0 B'
    
    const size = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    
    if (size === 0) return '0 B'
    
    const i = Math.floor(Math.log(size) / Math.log(1024))
    const formattedSize = (size / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)
    
    return `${formattedSize} ${sizes[i]}`
}

export const formatPath = (currentFolder) => {
    const breadcrumbs = [
        { name: 'Home', path: '/' } // Root always links to dashboard
    ]

    if (currentFolder?.path && currentFolder.path.length > 0) {
        currentFolder.path.forEach((folder) => {                
            breadcrumbs.push({
                name: folder.name,
                path: `/folder/${folder.id}`
            })
        })
    }
    return breadcrumbs
}