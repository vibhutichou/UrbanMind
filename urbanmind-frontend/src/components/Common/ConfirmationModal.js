import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { colors } from '../../styles/colors';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDanger = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        {isDanger && (
                            <div className="p-2 bg-red-100 rounded-full text-red-600">
                                <AlertTriangle size={24} />
                            </div>
                        )}
                        <h2 className="text-xl font-bold text-slate-800">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-8">
                    <p className="text-slate-600 leading-relaxed font-medium">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-5 py-2.5 rounded-xl text-white font-bold shadow-lg transform active:scale-95 transition-all
                            ${isDanger 
                                ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-500/25' 
                                : 'bg-violet-600 hover:bg-violet-700 hover:shadow-violet-500/25'
                            }
                        `}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
