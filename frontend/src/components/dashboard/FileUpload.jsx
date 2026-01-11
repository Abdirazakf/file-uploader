import { useState } from "react";
import { ArrowUp } from "lucide-react";

export default function FileUpload({ onUpload }){
    const [dragging, setDragging] = useState(false)

    const handleDragEnter = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setDragging(true)
    }

    const handleDragLeave = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setDragging(false)
    }

    const handleDragOver = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }

    const handleDrop = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setDragging(false)

        const files = Array.from(event.dataTransfer.files)
        
        if (files.length > 0 && onUpload){
            onUpload(files)
        }
    }

    const handleClick = () => {
        console.log('Click to upload test')
    }

    return (
        <div 
            className={`w-full h-24 border border-dashed rounded-lg flex flex-col items-center justify-center mb-8 group cursor-pointer transition-all ${
                dragging 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <div className="flex flex-col items-center gap-2">
                <div className={`p-2 rounded-full border transition-transform ${
                    dragging 
                        ? 'bg-blue-500/20 border-blue-500 scale-110' 
                        : 'bg-zinc-900 border-zinc-800 group-hover:scale-110'
                }`}>
                    <ArrowUp size={16} className={dragging ? 'text-blue-400' : 'text-zinc-500'} />
                </div>
                <span className={`text-xs font-medium ${
                    dragging ? 'text-blue-400' : 'text-zinc-500'
                }`}>
                    {dragging ? 'Drop files to upload' : 'Drop files here to upload'}
                </span>
            </div>
        </div>
    )
}