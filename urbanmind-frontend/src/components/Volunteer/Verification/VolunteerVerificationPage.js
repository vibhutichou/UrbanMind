import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import ResponsiveLayout from '../../Common/ResponsiveLayout';
import {
    Shield,
    CheckCircle,
    AlertCircle,
    FileText,
    Upload,
    Clock,
    XCircle,
    Send
} from 'lucide-react';

const VolunteerVerificationPage = () => {
    const [verificationStatus, setVerificationStatus] = useState({
        status: 'UNVERIFIED',
        documentUrl: '',
        notes: '',
        adminComment: '',
        submittedAt: null
    });

    const [formData, setFormData] = useState({
        documentUrl: '', // kept for compatibility if needed, but file upload uses 'file'
        notes: '',
        requestedRole: 'VOLUNTEER'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch verification status on mount
    const fetchStatus = React.useCallback(async () => {
        try {
            const res = await api.get('/verification/me');
            if (res.status === 204 || !res.data) {
                setVerificationStatus(prev => ({ ...prev, status: 'UNVERIFIED' }));
                return;
            }
            setVerificationStatus({
                status: res.data.status,
                documentUrl: res.data.documentUrl,
                notes: res.data.notes,
                adminComment: res.data.adminComment,
                submittedAt: res.data.createdAt
            });
        } catch (err) {
            if (err.response?.status === 404 || err.response?.status === 204) {
                setVerificationStatus(prev => ({ ...prev, status: 'UNVERIFIED' }));
            } else {
                console.error("Fetch error:", err);
            }
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    // Re-fetch on focus to keep status updated
    useEffect(() => {
        const handleFocus = () => fetchStatus();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchStatus]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation for file
        if (!formData.file) {
            alert("Please select a document/image to upload.");
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('file', formData.file);
            formDataToSend.append('notes', formData.notes);
            formDataToSend.append('requestedRole', formData.requestedRole);

            // Pass headers explicitly as undefined/custom to allow browser to set boundary
            await api.post('/verification', formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            await fetchStatus();
            alert("Verification request submitted successfully!");
        } catch (error) {
            console.error("Submission error:", error.response?.data || error.message);
            alert("Failed to submit verification request. Please check the file and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStatusCard = () => {
        // Normalize status check (backend might return uppercase)
        const status = verificationStatus.status?.toUpperCase();

        switch (status) {
            case 'VERIFIED':
            case 'APPROVED': // Handle potential approved alias
                return (
                    <div className="bg-green-50 border border-green-100 rounded-3xl p-8 flex flex-col md:flex-row items-start gap-6 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-4 bg-green-100 rounded-2xl shrink-0 text-green-600 shadow-inner">
                            <CheckCircle size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold text-green-900 mb-2">Verified Volunteer</h3>
                            <p className="text-green-800 text-lg leading-relaxed font-medium">
                                Your profile has been verified. You now have full access to all features and a verified badge on your profile.
                            </p>
                        </div>
                    </div>
                );
            case 'PENDING':
                return (
                    <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 flex flex-col md:flex-row items-start gap-6 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-4 bg-amber-100 rounded-2xl shrink-0 text-amber-600 shadow-inner">
                            <Clock size={32} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-extrabold text-amber-900 mb-2">Verification In Progress</h3>
                            <p className="text-amber-800 text-lg leading-relaxed font-medium mb-6">
                                Your verification request has been submitted on {verificationStatus.submittedAt ? new Date(verificationStatus.submittedAt).toLocaleDateString() : 'recent date'}.
                                Our admin team is reviewing your documents. This usually takes 24-48 hours.
                            </p>
                            <div className="p-5 bg-white/60 rounded-2xl border border-amber-100/50 backdrop-blur-sm">
                                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">Submitted Document</div>
                                {verificationStatus.documentUrl && (
                                    <div className="mb-3 rounded-xl overflow-hidden border border-amber-200/50 max-w-xs">
                                        <img
                                            src={verificationStatus.documentUrl?.startsWith("http")
                                                ? verificationStatus.documentUrl
                                                : `http://localhost:9000${verificationStatus.documentUrl}`}
                                            alt="Submitted Document"
                                            className="w-full h-auto object-cover"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                )}
                                <a
                                    href={verificationStatus.documentUrl?.startsWith("http")
                                        ? verificationStatus.documentUrl
                                        : `http://localhost:9000${verificationStatus.documentUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-amber-700 underline decoration-2 underline-offset-2 font-bold flex items-center gap-2 hover:text-amber-900 transition-colors"
                                >
                                    <FileText size={18} className="shrink-0" />
                                    View Document
                                </a>
                            </div>
                        </div>
                    </div>
                );
            case 'REJECTED':
                return (
                    <div className="bg-red-50 border border-red-100 rounded-3xl p-8 flex flex-col md:flex-row items-start gap-6 mb-8 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-4 bg-red-100 rounded-2xl shrink-0 text-red-600 shadow-inner">
                            <XCircle size={32} strokeWidth={2.5} />
                        </div>
                        <div className="w-full">
                            <h3 className="text-2xl font-extrabold text-red-900 mb-2">Verification Rejected</h3>
                            <p className="text-red-800 text-lg leading-relaxed font-medium mb-6">
                                Your request was rejected. Please review the feedback below and submit again.
                            </p>
                            {verificationStatus.adminComment && (
                                <div className="p-5 bg-white/60 rounded-2xl border border-red-100/50 backdrop-blur-sm text-red-900">
                                    <span className="font-bold block mb-1">Admin Comment:</span>
                                    {verificationStatus.adminComment}
                                </div>
                            )}
                        </div>
                    </div>
                );
            default: // UNVERIFIED
                return (
                    <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 flex flex-col md:flex-row items-start gap-6 mb-8 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="p-4 bg-rose-100 rounded-2xl shrink-0 text-rose-600 shadow-inner">
                            <AlertCircle size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold text-rose-900 mb-2">Get Verified</h3>
                            <p className="text-rose-800 text-lg leading-relaxed font-medium">
                                Verify your volunteer profile to serve better and gain trust within the community.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <ResponsiveLayout showRightSidebar={false} fullWidth={true}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="mb-10 pl-2 md:pl-0">
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-3 tracking-tight flex items-center gap-4">
                        <div className="p-2 bg-rose-100 rounded-2xl">
                            <Shield className="text-rose-600" size={32} strokeWidth={2.5} />
                        </div>
                        Verification Center
                    </h1>
                    <p className="text-xl text-slate-500 font-medium">Manage your verification status and documents</p>
                </div>

                {renderStatusCard()}

                {/* Submission Form */}
                {(verificationStatus.status?.toUpperCase() === 'UNVERIFIED' || verificationStatus.status?.toUpperCase() === 'REJECTED') && (
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 animate-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
                        <h2 className="text-2xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
                            Submit Verification Request
                            <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                    Identity Proof (Image/PDF)
                                </label>
                                <div className="flex flex-col gap-2">
                                    <div className="relative flex-1 group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Upload size={20} className="text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            required
                                            className="pl-12 w-full px-5 py-4 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                            onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500 mt-3 font-medium flex items-center gap-2">
                                    <AlertCircle size={14} />
                                    Please upload your Identity Proof (Aadhaar/PAN/Voter ID).
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                                    Additional Notes
                                </label>
                                <textarea
                                    rows="4"
                                    placeholder="Any additional details that might help with verification..."
                                    className="w-full px-5 py-4 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400 resize-none"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-3
                                        ${isSubmitting
                                            ? 'bg-slate-400 cursor-not-allowed shadow-none hover:translate-y-0'
                                            : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:shadow-rose-500/30 active:scale-[0.98]'
                                        }
                                    `}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Request
                                            <Send size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </ResponsiveLayout>
    );
};

export default VolunteerVerificationPage;
