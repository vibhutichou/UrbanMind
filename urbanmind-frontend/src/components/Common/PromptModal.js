import React, { useState } from 'react';
import { X } from 'lucide-react';

const PromptModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    placeholder = "",
    confirmText = "Submit",
    cancelText = "Cancel",
    isTextArea = false
}) => {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(inputValue);
        handleClose();
    };

    const handleClose = () => {
        setInputValue('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={handleClose}>
            <div 
                className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">
                        {title}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="text-slate-600 leading-relaxed font-medium mb-4">
                    {message}
                </p>

                <form onSubmit={handleSubmit}>
                    {isTextArea ? (
                        <textarea
                            autoFocus
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-700 bg-slate-50 mb-6 resize-none"
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    ) : (
                        <input
                            autoFocus
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-700 bg-slate-50 mb-6"
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    )}

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 shadow-lg hover:shadow-violet-500/25 transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {confirmText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromptModal;
