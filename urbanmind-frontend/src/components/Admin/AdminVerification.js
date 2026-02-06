import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';  // Adjust path if needed (e.g., '../../../api/axios')
import ResponsiveLayout from '../Common/ResponsiveLayout';
import {
    Search,
    Filter,
    Check,
    X,
    Shield,
    User,
    Heart,
    Building,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    FileText,
    ExternalLink,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Award,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import ConfirmationModal from '../Common/ConfirmationModal';  // Ensure this exists; if not, replace with window.confirm
import PromptModal from '../Common/PromptModal';  // Ensure this exists; if not, replace with window.prompt

const AdminVerification = () => {
    const [requests, setRequests] = useState([]);
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [verifyId, setVerifyId] = useState(null);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const [rejectId, setRejectId] = useState(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    const fetchRequests = useCallback(async () => {
        try {
            const res = await api.get('/verification-requests');
            setRequests(res.data);
        } catch (error) {
            console.error("Failed to fetch requests:", error);
            alert("Failed to load requests. Check your token/role.");
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const filteredRequests = requests.filter(req => {
        const matchesRole = roleFilter === 'ALL' || req.requestedRole === roleFilter;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            req.user?.fullName?.toLowerCase().includes(searchLower) ||
            req.id?.toString().includes(searchLower) ||
            req.user?.email?.toLowerCase().includes(searchLower);
        return matchesRole && matchesSearch;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    const handleVerifyClick = (id) => {
        setVerifyId(id);
        setIsVerifyModalOpen(true);
    };

    const handleConfirmVerify = () => {
        if (verifyId) {
            updateStatus(verifyId, 'APPROVED');
            setIsVerifyModalOpen(false);
        }
    };

    const handleRejectClick = (id) => {
        setRejectId(id);
        setIsRejectModalOpen(true);
    };

    const handleConfirmReject = (reason) => {
        if (rejectId) {
            updateStatus(rejectId, 'REJECTED', reason);
            setIsRejectModalOpen(false);
        }
    };

    const updateStatus = async (id, status, comment = null) => {
        try {
            await api.patch(`/verification-requests/${id}/status`, {
                status,
                adminComment: comment
            });

            await fetchRequests();  // Re-fetch to reflect changes
            if (selectedRequest?.id === id) {
                setShowModal(false);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            alert(`Failed to ${status.toLowerCase()} request: ${error.response?.data?.message || error.message}`);
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'APPROVED':
            case 'VERIFIED':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"><CheckCircle className="w-3.5 h-3.5" />APPROVED</span>;
            case 'REJECTED':
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"><XCircle className="w-3.5 h-3.5" />Rejected</span>;
            default:
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200"><Clock className="w-3.5 h-3.5" />Pending</span>;
        }
    };

    const getRoleIcon = (role) => {
        switch (role?.toUpperCase()) {
            case 'NGO': return <Building className="w-4 h-4 text-purple-600" />;
            case 'VOLUNTEER': return <Heart className="w-4 h-4 text-red-600" />;
            default: return <User className="w-4 h-4 text-blue-600" />;
        }
    };

    return (
        <ResponsiveLayout showRightSidebar={false} fullWidth={true}>
            <div className="p-6 w-full relative">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-600 mb-2 flex items-center gap-2"><Shield className="w-8 h-8 text-blue-600" />Verification Requests</h1>
                    <p className="text-gray-500">Manage and verify role requests for NGOs, Volunteers, and Citizens.</p>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex p-1 bg-gray-100 rounded-lg w-full md:w-auto overflow-x-auto">
                        {['ALL', 'CITIZEN', 'VOLUNTEER', 'NGO'].map(tab => (
                            <button key={tab} onClick={() => setRoleFilter(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${roleFilter === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{tab}</button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full overflow-y-auto">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                                    <th className="px-6 py-4">Request ID</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm">#{req.id}</td>
                                        <td className="px-6 py-4 text-sm font-medium">{req.user?.fullName || 'N/A'}</td>
                                        <td className="px-6 py-4 flex items-center gap-2">{getRoleIcon(req.requestedRole)} {req.requestedRole}</td>
                                        <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => { setSelectedRequest(req); setShowModal(true); }} className="p-2 text-gray-500 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedRequests.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                            No verification requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {filteredRequests.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 items-center bg-gray-50/50 gap-4">
                            <span className="text-sm text-gray-500 text-center md:text-left">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length} requests
                            </span>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    title="Previous Page"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    title="Next Page"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="hidden md:block"></div>
                        </div>
                    )}
                </div>

                {showModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
                            <h3 className="text-lg font-bold mb-4">Verification Details</h3>
                            <div className="space-y-4">
                                <p><strong>User:</strong> {selectedRequest.user?.fullName || 'N/A'} ({selectedRequest.user?.email || 'N/A'})</p>
                                <p><strong>Requested Role:</strong> {selectedRequest.requestedRole}</p>
                                <p><strong>Notes:</strong> {selectedRequest.notes || "None"}</p>

                                {selectedRequest.documentUrl && (
                                    <div className="mt-4 mb-3 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                        <img
                                            src={selectedRequest.documentUrl?.startsWith("http")
                                                ? selectedRequest.documentUrl
                                                : `http://localhost:9000${selectedRequest.documentUrl}`}
                                            alt="Verification Document"
                                            className="w-full h-auto max-h-[300px] object-contain"
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                )}



                                <a
                                    href={selectedRequest.documentUrl?.startsWith("http")
                                        ? selectedRequest.documentUrl
                                        : `http://localhost:9000${selectedRequest.documentUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline flex items-center gap-2"
                                >
                                    <FileText className="w-4 h-4" /> View Document (Full Size)
                                </a>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600">Close</button>
                                {selectedRequest.status?.toUpperCase() === 'PENDING' && (
                                    <>
                                        <button onClick={() => handleRejectClick(selectedRequest.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg">Reject</button>
                                        <button onClick={() => handleVerifyClick(selectedRequest.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Verify</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <ConfirmationModal isOpen={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)} onConfirm={handleConfirmVerify} title="Verify User" message="Grant privileges?" confirmText="Verify" />
                <PromptModal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} onConfirm={handleConfirmReject} title="Reject Request" message="Reason?" placeholder="Enter reason..." confirmText="Reject" isTextArea={true} />
            </div>
        </ResponsiveLayout>
    );
};

export default AdminVerification;