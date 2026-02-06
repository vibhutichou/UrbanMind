import React, { useState, useEffect } from 'react';
import ResponsiveLayout from '../Common/ResponsiveLayout';
import {
    Search,
    Trash2,
    User,
    Heart,
    Building,
    CheckCircle,
    Mail,
    Phone,
    MapPin,
    Eye,
    X,
    Calendar,
    FileText,
    MessageSquare,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import ConfirmationModal from '../Common/ConfirmationModal';
import profileService from '../../services/profileService';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Start with Delete Modal states
    const [deleteId, setDeleteId] = useState(null);
    const [deleteName, setDeleteName] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // View Modal State
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch Users
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                // Returns List<UserDTO>
                const data = await profileService.getAllProfiles(roleFilter);
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
                // Fallback to empty list or handled error
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [roleFilter]);

    // Filtering Logic (frontend search on fetched results)
    const filteredUsers = users.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (user.fullName && user.fullName.toLowerCase().includes(searchLower)) ||
            (user.username && user.username.toLowerCase().includes(searchLower)) ||
            (user.email && user.email.toLowerCase().includes(searchLower))
        );
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const getRoleIcon = (role) => {
        switch (role?.toLowerCase()) {
            case 'ngo': return <Building className="w-4 h-4 text-purple-600" />;
            case 'volunteer': return <Heart className="w-4 h-4 text-red-600" />;
            default: return <User className="w-4 h-4 text-blue-600" />;
        }
    };

    const handleDeleteUserClick = (id, name) => {
        setDeleteId(id);
        setDeleteName(name);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                // Note: profileService.deleteProfile requires role. 
                // We need to find the user's role.
                const userToDelete = users.find(u => u.id === deleteId);
                if (userToDelete) {
                    await profileService.deleteProfile(userToDelete.role, deleteId);
                    setUsers(users.filter(u => u.id !== deleteId));
                    setDeleteId(null);
                    setDeleteName('');
                }
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete user.");
            }
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const tabs = [
        { id: 'all', label: 'All Users' },
        { id: 'citizen', label: 'Citizens' },
        { id: 'volunteer', label: 'Volunteers' },
        { id: 'ngo', label: 'NGOs' },
    ];

    return (
        <ResponsiveLayout showRightSidebar={false} fullWidth={true}>
            <div className="p-6 w-full relative">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[rgb(107,114,128)] mb-2 flex items-center gap-2">
                        <User className="w-8 h-8 text-blue-600" />
                        User Management
                    </h1>
                    <p className="text-gray-500">
                        View and manage all verified users on the platform.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    {/* Tabs */}
                    <div className="flex p-1 bg-gray-100 rounded-lg w-full md:w-auto overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setRoleFilter(tab.id)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${roleFilter === tab.id
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full overflow-y-auto">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                                        {user.profilePhotoUrl ? (
                                                            <img src={user.profilePhotoUrl} alt={user.fullName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            (user.fullName || user.username || 'U').charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900">{user.fullName || user.username}</span>
                                                        <span className="text-xs text-gray-500">@{user.username}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getRoleIcon(user.role)}
                                                    <span className="text-sm font-medium text-gray-700 capitalize">{user.role}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <Phone className="w-3 h-3" />
                                                        {user.phone || 'N/A'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                    {user.city || 'Unknown'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewUser(user)}
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUserClick(user.id, user.fullName)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                            No users found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {filteredUsers.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 items-center bg-gray-50/50 gap-4">
                            <span className="text-sm text-gray-500 text-center md:text-left">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
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

                {/* VIEW USER MODAL */}
                {showModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 opacity-100 my-8">
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    User Details
                                </h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                {/* User Info Header */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold border-2 border-white shadow-sm overflow-hidden">
                                        {selectedUser.profilePhotoUrl ? (
                                            <img src={selectedUser.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            (selectedUser.fullName || 'U').charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900">{selectedUser.fullName}</h4>
                                                <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {getRoleIcon(selectedUser.role)}
                                                    <span className="text-sm font-medium text-gray-700 capitalize">{selectedUser.role}</span>
                                                </div>
                                            </div>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Verified
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs / Sections */}
                                <div className="space-y-6">
                                    {/* Contact & Location Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                            <span className="text-xs text-gray-500 block mb-1">Email Address</span>
                                            <div className="flex items-center gap-2 font-medium text-gray-800">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                {selectedUser.email}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                            <span className="text-xs text-gray-500 block mb-1">Phone Number</span>
                                            <div className="flex items-center gap-2 font-medium text-gray-800">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                {selectedUser.phone || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                            <span className="text-xs text-gray-500 block mb-1">Location</span>
                                            <div className="flex items-center gap-2 font-medium text-gray-800">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                {selectedUser.city}, {selectedUser.state || ''}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                            <span className="text-xs text-gray-500 block mb-1">Joined Date</span>
                                            <div className="flex items-center gap-2 font-medium text-gray-800">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Posts / Activity Section */}
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Recent Posts & Activity
                                        </h4>

                                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <MessageSquare className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <h5 className="text-gray-900 font-medium mb-1">No Recent Posts</h5>
                                            <p className="text-sm text-gray-500">
                                                This user has not posted any {selectedUser.role === 'CITIZEN' ? 'problems' : 'solutions'} yet.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                    title="Delete User?"
                    message={`Are you sure you want to PERMANENTLY DELETE user "${deleteName}"? This action cannot be undone.`}
                    confirmText="Delete Permanently"
                    isDanger={true}
                />
            </div>
        </ResponsiveLayout>
    );
};

export default AdminUserManagement;
