import React from 'react';
import { X, CheckCircle, Info, AlertCircle } from 'lucide-react';

const AlertModal = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'info', // 'success', 'error', 'info', 'warning'
    buttonText = "OK"
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={28} className="text-green-600" />;
            case 'error': return <AlertCircle size={28} className="text-red-600" />;
            case 'warning': return <AlertCircle size={28} className="text-amber-600" />;
            default: return <Info size={28} className="text-blue-600" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case 'success': return 'bg-green-100';
            case 'error': return 'bg-red-100';
            case 'warning': return 'bg-amber-100';
            default: return 'bg-blue-100';
        }
    };

    // Auto-close for success if user doesn't interact (optional UX enhancement, but sticking to standard alert behavior here mostly)
    
    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 animate-in zoom-in-95 duration-200 text-center"
                onClick={e => e.stopPropagation()}
            >
                <div className={`mx-auto w-16 h-16 rounded-full ${getBgColor()} flex items-center justify-center mb-4 shadow-inner`}>
                    {getIcon()}
                </div>

                <h2 className="text-xl font-bold text-slate-800 mb-2">
                    {title}
                </h2>

                <p className="text-slate-600 leading-relaxed font-medium mb-6">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg transform active:scale-95 transition-all"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default AlertModal;
