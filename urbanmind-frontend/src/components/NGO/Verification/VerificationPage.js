import React, { useEffect, useState, useCallback } from 'react';
import api from '../../../api/axios';  // Adjust path if needed (e.g., '../../api/axios')
import axios from 'axios'; // Direct axios for file upload
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

const VerificationPage = () => {
    const [verificationStatus, setVerificationStatus] = useState({
        status: 'UNVERIFIED',
        documentUrl: '',
        notes: '',
        adminComment: '',
        submittedAt: null
    });

    const [formData, setFormData] = useState({
        documentUrl: '',
        notes: '',
        requestedRole: 'NGO'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchStatus = useCallback(async () => {
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

    useEffect(() => {
        const handleFocus = () => fetchStatus();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchStatus]);

    const handleSubmit = async (e) => {
        e.preventDefault();

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

            // Pass headers explicitly as undefined to allow browser to set boundary
            await api.post('/verification', formDataToSend, {
                headers: { "Content-Type": undefined }
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
        const status = verificationStatus.status?.toUpperCase();
        switch (status) {
            case 'VERIFIED':
            case 'APPROVED':
                return (
                    <div className="bg-green-50 border border-green-100 rounded-3xl p-8 flex flex-col md:flex-row items-start gap-6 shadow-sm">
                        <div className="p-4 bg-green-100 rounded-2xl text-green-600">
                            <CheckCircle size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold text-green-900 mb-2">Verified Organization</h3>
                            <p className="text-green-800 text-lg font-medium">Your organization has been verified. You now have full access to NGO features.</p>
                        </div>
                    </div>
                );
            case 'PENDING':
                return (
                    <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 flex flex-col md:flex-row items-start gap-6 shadow-sm">
                        <div className="p-4 bg-amber-100 rounded-2xl text-amber-600">
                            <Clock size={32} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-extrabold text-amber-900 mb-2">Verification In Progress</h3>
                            <p className="text-amber-800 text-lg font-medium mb-6">Submitted on {new Date(verificationStatus.submittedAt).toLocaleDateString()}. Admin review takes 24-48 hours.</p>
                            <div className="p-5 bg-white/60 rounded-2xl border border-amber-100/50">
                                {verificationStatus.documentUrl && (
                                    <div className="mb-3 rounded-xl overflow-hidden border border-amber-200/50">
                                        <img
                                            src={verificationStatus.documentUrl?.startsWith("http")
                                                ? verificationStatus.documentUrl
                                                : `http://localhost:9000${verificationStatus.documentUrl}`}
                                            alt="Submitted Document"
                                            className="w-full h-auto max-h-[200px] object-contain bg-white"
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
                                    className="text-amber-700 underline font-bold flex items-center gap-2"
                                >
                                    <FileText size={18} /> View Submitted Document
                                </a>
                            </div>
                        </div>
                    </div>
                );
            case 'REJECTED':
                return (
                    <div className="bg-red-50 border border-red-100 rounded-3xl p-8 mb-8">
                        <div className="flex gap-6">
                            <div className="p-4 bg-red-100 rounded-2xl text-red-600"><XCircle size={32} /></div>
                            <div>
                                <h3 className="text-2xl font-extrabold text-red-900">Verification Rejected</h3>
                                <p className="text-red-800 mt-2">{verificationStatus.adminComment || "Please review your documents and try again."}</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="bg-violet-50 border border-violet-100 rounded-3xl p-8 mb-8 flex gap-6">
                        <div className="p-4 bg-violet-100 rounded-2xl text-violet-600"><AlertCircle size={32} /></div>
                        <div>
                            <h3 className="text-2xl font-extrabold text-violet-900">Get Verified</h3>
                            <p className="text-violet-800 text-lg">Verify your NGO to unlock fundraising and higher visibility.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <ResponsiveLayout showRightSidebar={false} fullWidth={true}>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-4">
                        <Shield className="text-violet-600" size={40} /> Verification Center
                    </h1>
                </div>


                {renderStatusCard()}

                {(verificationStatus.status?.toUpperCase() === 'UNVERIFIED' || verificationStatus.status?.toUpperCase() === 'REJECTED') && (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mt-8">
                        <h2 className="text-2xl font-extrabold text-slate-800 mb-8">Submit Verification Request</h2>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Registration Document (Image/PDF)</label>
                                <div className="relative">
                                    <Upload className="absolute left-4 top-4 text-slate-400" size={20} />
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        className="pl-12 w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-500 transition-all"
                                        onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase">Additional Notes</label>
                                <textarea
                                    rows="4" placeholder="Any details to help with verification..."
                                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-500 transition-all resize-none"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit" disabled={isSubmitting}
                                className={`w-full py-4 rounded-2xl font-bold text-lg text-white transition-all ${isSubmitting ? 'bg-slate-400' : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg hover:-translate-y-1'}`}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Request"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </ResponsiveLayout>
    );
};

export default VerificationPage;