import { Link } from 'react-router'
import { LayoutGrid, List, Slash, UploadCloud } from 'lucide-react'

export default function MainHeader({
    breadcrumbs = [{ name: 'Home', path: '/' }],
    viewMode,
    onViewModeChange,
    onUploadClick,
    actions, // Custom action buttons
}) {
    return (
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/95 backdrop-blur-sm z-20">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {index > 0 && (
                            <Slash size={12} className='text-zinc-700' />
                        )}
                        {index === breadcrumbs.length - 1 ? (
                            // Last item not clickable
                            <span className="text-zinc-200 font-medium flex items-center gap-1">
                                {crumb.icon && (
                                    <span className={crumb.iconColor || 'text-blue-400'}>
                                        {crumb.icon}
                                    </span>
                                )}
                                {crumb.name}
                            </span>
                        ) : (
                            // Previous items are clickable
                            <Link
                                to={crumb.path}
                                className='text-zinc-500 hover:text-zinc-300 transition-colors'
                            >
                                {crumb.name}
                            </Link>
                        )}
                    </div>
                ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
                {/* Custom Actions (for FolderView: Share, New, etc) */}
                {actions && actions}

                {/* View Mode Toggle */}
                {onViewModeChange && (
                    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-sm p-0.5">
                        <button
                            onClick={() => onViewModeChange('grid')}
                            className={`p-1.5 rounded-sm transition-colors ${
                                viewMode === 'grid' 
                                    ? 'bg-zinc-800 text-zinc-100 shadow-sm' 
                                    : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            <LayoutGrid size={14} />
                        </button>
                        <button
                            onClick={() => onViewModeChange('list')}
                            className={`p-1.5 rounded-sm transition-colors ${
                                viewMode === 'list' 
                                    ? 'bg-zinc-800 text-zinc-100 shadow-sm' 
                                    : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            <List size={14} />
                        </button>
                    </div>
                )}

                {onUploadClick && (
                    <button
                        onClick={onUploadClick}
                        className="cursor-pointer hidden sm:flex items-center gap-2 bg-zinc-100 hover:bg-white text-black px-3 py-1.5 rounded-sm text-sm font-medium transition-colors"
                    >
                        <UploadCloud size={14} />
                        <span>Upload</span>
                    </button>
                )}
            </div>
        </header>
    )
}