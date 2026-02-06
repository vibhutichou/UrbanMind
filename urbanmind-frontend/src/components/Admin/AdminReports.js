// src/components/Admin/AdminReports.js
import React, { useState, useEffect } from 'react';
import ResponsiveLayout from '../Common/ResponsiveLayout';
import {
    FileText,
    Search,
    Filter,
    Download,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    checkCircle,
    XCircle,
    AlertCircle,
    Edit,
    Trash2,
    X,
    Check,
    Eye
} from 'lucide-react';
import { colors } from '../../styles/colors';
import ConfirmationModal from '../Common/ConfirmationModal';
import { getReportsByStatus, updateReportStatus } from '../../services/reportService';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0,
    });

    // Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        status: '',
        updated_at: ''
    });

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const status = statusFilter === 'all' ? '' : statusFilter;
                const data = await getReportsByStatus(status, pagination.page, pagination.size);
                setReports(data.content);
                setPagination(prev => ({
                    ...prev,
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                }));
            } catch (err) {
                setError('Failed to fetch reports.');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [statusFilter, pagination.page, pagination.size]);


    const filteredReports = reports.filter(report => {
        const searchLower = searchTerm.toLowerCase();
        return (
            report.id.toString().toLowerCase().includes(searchLower) ||
            report.reason_code.toLowerCase().includes(searchLower) ||
            (report.reason_text && report.reason_text.toLowerCase().includes(searchLower)) ||
            report.reporter_user_id.toString().includes(searchLower)
        );
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
            case 'investigating': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'pending': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Actions
    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            setReports(reports.filter(report => report.id !== deleteId));
            setDeleteId(null);
        }
    };

    const openEditModal = (report) => {
        setSelectedReport(report);
        setEditForm({
            status: report.status,
            updated_at: new Date().toISOString().slice(0, 16) // Current time for input type="datetime-local"
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedReport) return;

        try {
            await updateReportStatus(selectedReport.id, editForm.status);
            setReports(reports.map(report =>
                report.id === selectedReport.id
                    ? { ...report, status: editForm.status, updated_at: new Date(editForm.updated_at).toISOString() }
                    : report
            ));
            setShowEditModal(false);
        } catch (error) {
            setError("Failed to update report status.");
        }
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedReport(null);
    };

    const openViewModal = (report) => {
        setSelectedReport(report);
        setShowViewModal(true);
    };

    const closeViewModal = () => {
        setShowViewModal(false);
        setSelectedReport(null);
    };
    
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    if (loading) return <div className="p-6">Loading reports...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <ResponsiveLayout showRightSidebar={false} fullWidth={true}>
            <div className="p-6 w-full relative">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-500 mb-2">
                        Reports Management
                    </h1>
                    <p className="text-gray-500">
                        Review and manage user reports, content violations, and system flags.
                    </p>
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search reports by ID, reason, or user..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <select
                                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none cursor-pointer hover:bg-gray-100 transition-all text-gray-600 font-medium"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="investigating">Investigating</option>
                                <option value="resolved">Resolved</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Report ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Target</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reporter</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                #{report.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 capitalize">{report.target_type}</span>
                                                <span className="text-xs text-gray-500">ID: {report.target_id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-800">{report.reason_code}</span>
                                                <p className="text-sm text-gray-500 truncate" title={report.reason_text}>
                                                    {report.reason_text}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            User #{report.reporter_user_id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(report.created_at).toLocaleDateString()}
                                            <br />
                                            <span className="text-xs text-gray-400">{new Date(report.created_at).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openViewModal(report)}
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="View Content"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(report)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Report"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(report.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Report"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        <span className="text-sm text-gray-500">
                            Showing <span className="font-medium text-gray-900">{(pagination.page * pagination.size) + 1}</span> to <span className="font-medium text-gray-900">{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}</span> of <span className="font-medium text-gray-900">{pagination.totalElements}</span> results
                        </span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 0}
                                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-500 disabled:opacity-50 hover:bg-gray-50 transition-all">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages - 1}
                                className="p-2 border border-gray-200 rounded-lg bg-white text-gray-500 disabled:opacity-50 hover:bg-gray-50 transition-all">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Report?"
                    message="Are you sure you want to permanently delete this report? This action cannot be undone."
                    confirmText="Delete Report"
                    isDanger={true}
                />

                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100 opacity-100">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800">
                                    Edit Report <span className="text-blue-600 font-mono text-base ml-2">#{selectedReport?.id}</span>
                                </h3>
                                <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Report Details Summary */}
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Target Type:</span>
                                        <span className="font-medium capitalize">{selectedReport?.target_type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Reason:</span>
                                        <span className="font-medium">{selectedReport?.reason_code}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Reporter:</span>
                                        <span className="font-medium">User #{selectedReport?.reporter_user_id}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <div className="relative">
                                            <select
                                                className="w-full pl-3 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none appearance-none transition-all"
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="investigating">Investigating</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Update Time</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                            value={editForm.updated_at}
                                            onChange={(e) => setEditForm({ ...editForm, updated_at: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">This will update the reported updated_at timestamp.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                                <button
                                    onClick={closeEditModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-all transform active:scale-95"
                                >
                                    <Check className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* View Content Modal */}
                {showViewModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all scale-100 opacity-100">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-gray-500" />
                                    Reported Content
                                </h3>
                                <button onClick={closeViewModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                        <span className="font-medium text-gray-700 capitalize">{selectedReport?.target_type}</span>
                                        <span>•</span>
                                        <span>ID: {selectedReport?.target_id}</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                                        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                                            {selectedReport?.content_snapshot || "No content snapshot available."}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex gap-3 items-start">
                                    <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-medium text-orange-800">Report Reason</h4>
                                        <p className="text-sm text-orange-700 mt-1">
                                            {selectedReport?.reason_code}: {selectedReport?.reason_text}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
                                <button
                                    onClick={closeViewModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white hover:border-gray-300 border border-transparent rounded-lg transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ResponsiveLayout>
    );
};

export default AdminReports;
