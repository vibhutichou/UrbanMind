import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '../../Common/ResponsiveLayout';
import {
    Plus,
    Search,
    Mail,
    Phone,
    Edit2,
    Trash2,
    X,
    MapPin
} from 'lucide-react';
import ConfirmationModal from '../../Common/ConfirmationModal';

const TeamPage = () => {
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState(null); // ID of member to delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Mock Data based on users table
    const [members, setMembers] = useState([
        {
            id: 1,
            full_name: 'Priya Sharma',
            primary_role: 'Project Lead',
            email: 'priya.sharma@urbanmind.org',
            phone: '+91 98765 43210',
            status: 'Active',
            city: 'Mumbai',
            state: 'Maharashtra',
            created_at: 'Jan 2024',
            profile_photo_url: null
        },
        {
            id: 2,
            full_name: 'Arjun Patel',
            primary_role: 'Coordinator',
            email: 'arjun.patel@urbanmind.org',
            phone: '+91 98765 12345',
            status: 'Active',
            city: 'Pune',
            state: 'Maharashtra',
            created_at: 'Feb 2024',
            profile_photo_url: null
        },
        {
            id: 3,
            full_name: 'Neha Singh',
            primary_role: 'Finance Manager',
            email: 'neha.singh@urbanmind.org',
            phone: '+91 98765 67890',
            status: 'On Leave',
            city: 'Bangalore',
            state: 'Karnataka',
            created_at: 'Dec 2023',
            profile_photo_url: null
        }
    ]);

    const [formData, setFormData] = useState({
        full_name: '',
        primary_role: '',
        email: '',
        phone: '',
        status: 'Active',
        city: '',
        state: ''
    });

    const handleAdd = () => {
        setEditingMember(null);
        setFormData({
            full_name: '',
            primary_role: '',
            email: '',
            phone: '',
            status: 'Active',
            city: '',
            state: ''
        });
        setShowAddModal(true);
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setFormData({
            full_name: member.full_name,
            primary_role: member.primary_role,
            email: member.email,
            phone: member.phone,
            status: member.status,
            city: member.city,
            state: member.state
        });
        setShowAddModal(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            setMembers(members.filter(m => m.id !== deleteId));
            setDeleteId(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingMember) {
            setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...formData } : m));
        } else {
            setMembers([...members, {
                id: Date.now(),
                ...formData,
                created_at: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                profile_photo_url: null
            }]);
        }
        setShowAddModal(false);
    };

    const filteredMembers = members.filter(member =>
        member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.primary_role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ResponsiveLayout showRightSidebar={false} fullWidth={true}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Team Members</h1>
                        <p className="text-slate-500 mt-1 font-medium">Manage your organization's team</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm md:text-base active:scale-95"
                    >
                        <Plus size={window.innerWidth < 768 ? 18 : 20} />
                        <span className="hidden md:inline">Add Member</span>
                        <span className="md:hidden">Add</span>
                    </button>
                </div>

                {/* Stats & Filter Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Total Members</div>
                        <div className="text-3xl font-extrabold text-slate-800">{members.length}</div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Active Now</div>
                        <div className="text-3xl font-extrabold text-green-600">
                            {members.filter(m => m.status === 'Active').length}
                        </div>
                    </div>

                    <div className="col-span-2 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search size={20} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or role..."
                            className="pl-11 w-full h-full min-h-[60px] rounded-2xl border-slate-200 bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all shadow-sm font-medium text-slate-700 placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredMembers.map((member, index) => (
                        <div 
                            key={member.id} 
                            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-in slide-in-from-bottom-8 fill-mode-both"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg bg-gradient-to-br from-violet-500 to-fuchsia-600`}>
                                        {member.full_name ? member.full_name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div 
                                        onClick={() => navigate(`/u/${member.id}`)}
                                        className="cursor-pointer group-hover/member:text-violet-700 transition-colors"
                                    >
                                        <h3 className="font-bold text-lg text-slate-800 mb-0.5">{member.full_name}</h3>
                                        <p className="text-sm text-violet-600 font-bold bg-violet-50 px-2 py-0.5 rounded-lg inline-block">{member.primary_role}</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                        member.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 
                                        member.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-slate-50 text-slate-600 border-slate-100'
                                    }`}>
                                        {member.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center gap-3 text-slate-600 text-sm group-hover:text-slate-900 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                        <Mail size={16} />
                                    </div>
                                    <span className="truncate font-medium">{member.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 text-sm group-hover:text-slate-900 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                        <Phone size={16} />
                                    </div>
                                    <span className="font-medium">{member.phone}</span>
                                </div>
                                {(member.city || member.state) && (
                                    <div className="flex items-center gap-3 text-slate-600 text-sm group-hover:text-slate-900 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="font-medium">{[member.city, member.state].filter(Boolean).join(', ')}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                                <div className="text-xs font-semibold text-slate-400">
                                    Joined {member.created_at}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all active:scale-95"
                                        title="Edit"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(member.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Remove Team Member?"
                message="Are you sure you want to remove this team member? This action cannot be undone."
                confirmText="Remove Member"
                isDanger={true}
            />

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div 
                        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-8 animate-in zoom-in-95 duration-300 slide-in-from-bottom-8"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {editingMember ? 'Edit Team Member' : 'Add New Member'}
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">Fill in the details below</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Project Lead"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium"
                                        value={formData.primary_role}
                                        onChange={(e) => setFormData({ ...formData, primary_role: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium bg-white"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="On Leave">On Leave</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="+1 234 567 890"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors shadow-lg hover:shadow-violet-500/25 active:scale-95 transform"
                                >
                                    {editingMember ? 'Save Changes' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </ResponsiveLayout>
    );
};

export default TeamPage;
