// components/Toast.jsx
import toast from 'react-hot-toast';
import { Check, X, AlertCircle } from 'lucide-react';

export const showSuccessToast = (title, message) => {
    toast.custom((t) => (
        <div 
        className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
        } bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-3 rounded shadow-2xl flex items-center gap-3 min-w-75`}
        >
            <div className="w-5 h-5 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shrink-0">
                <Check size={12} />
            </div>
            <div className="flex-1">
                <p className="text-xs font-medium">{title}</p>
            
                {message && (
                    <p className="text-[10px] text-zinc-500 mt-0.5">{message}</p>
                )}
            </div>
            <button
            onClick={() => toast.dismiss(t.id)}
            className="text-zinc-500 hover:text-white transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    ), {
        duration: 3000,
    });
};

export const showErrorToast = (title, message) => {
    toast.custom((t) => (
        <div
        className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
        } bg-zinc-900 border border-red-900/50 text-zinc-100 px-4 py-3 rounded shadow-2xl flex items-center gap-3 min-w-75`}
        >
            <div className="w-5 h-5 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle size={12} />
            </div>

            <div className="flex-1">
                <p className="text-xs font-medium">{title}</p>
                {message && (
                    <p className="text-[10px] text-zinc-500 mt-0.5">{message}</p>
                )}
            </div>
            <button
            onClick={() => toast.dismiss(t.id)}
            className="text-zinc-500 hover:text-white transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    ), {
        duration: 3000,
    });
};