import React, { useState } from 'react';
import { usePost } from '../../../context/PostContext';
import ResponsiveLayout from '../../Common/ResponsiveLayout';
import {
    Search,
    MapPin,
    Calendar,
    Users,
    Share2,
    Edit,
    X,
    Save,
    Briefcase
} from 'lucide-react';
import {
    getAssignedProblems,
    updateProblem,
    getProblemMedia,
    shareProblem
} from '../../../api/problemApi';

const ProjectsPage = () => {
    const { createPost } = usePost();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Edit Modal State
    const [editingProject, setEditingProject] = useState(null);
    const [editForm, setEditForm] = useState({
        amount_raised: 0,
        teamSize: 0,
        created_at: ''
    });

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await getAssignedProblems();
            const data = response.data || [];

            const mappedProjects = await Promise.all(
                data.map(async (p) => {
                    let mediaUrl = null;
                    try {
                        const mediaRes = await getProblemMedia(p.id);
                        if (mediaRes.data?.length > 0) {
                            mediaUrl = mediaRes.data[0].mediaUrl;
                        }
                    } catch { }

                    return {
                        id: p.id,
                        title: p.title,
                        description: p.description,
                        category: p.category || 'General',
                        address_line: p.addressLine || 'Unknown Location',
                        city: p.city || '',
                        state: p.state || '',
                        pincode: p.pincode || '',
                        status: p.status || 'Active', // Default to Active if assigned
                        severity: p.severity || 'Medium',
                        progress: p.progress || 0,
                        teamSize: p.teamCount || 0,
                        target_amount: p.budget || 0,
                        amount_raised: p.amountSpent || 0, // Mapping amountSpent to amount_raised for now, or need clarification
                        image: mediaUrl ? `http://localhost:9000${mediaUrl}` : 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800',
                        created_at: p.createdAt || new Date().toISOString()
                    };
                })
            );
            setProjects(mappedProjects);
        } catch (err) {
            console.error("Failed to fetch projects", err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchProjects();
    }, []);

    const handleShare = async (project) => {
        try {
            await createPost({
                title: project.title,
                description: project.description,
                category: project.category,
                location: project.address_line,
                images: project.image ? [project.image] : [],
                type: 'Project Update'
            });
            alert('Project shared to feed successfully!');
        } catch (error) {
            console.error('Failed to share project:', error);
            alert('Failed to share project. Please try again.');
        }
    };

    const handleEditClick = (project) => {
        setEditingProject(project);
        setEditForm({
            amount_raised: project.amount_raised,
            teamSize: project.teamSize,
            created_at: project.created_at.split('T')[0], // Format for date input
            progress: project.progress || 0,
            status: project.status
        });
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        try {
            await updateProblem(editingProject.id, {
                status: editForm.status,
                progress: Number(editForm.progress),
                teamCount: Number(editForm.teamSize),
                amountSpent: Number(editForm.amount_raised) // Assuming this maps to amountSpent
                // Add other fields as necessary
            });

            setProjects(projects.map(p => {
                if (p.id === editingProject.id) {
                    return {
                        ...p,
                        amount_raised: Number(editForm.amount_raised),
                        teamSize: Number(editForm.teamSize),
                        created_at: new Date(editForm.created_at).toISOString(),
                        progress: Number(editForm.progress),
                        status: editForm.status
                    };
                }
                return p;
            }));
            alert("Project updated successfully!");
            setEditingProject(null);
        } catch (err) {
            console.error("Failed to update project", err);
            alert("Failed to update project.");
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-blue-100 text-blue-700';
            case 'Completed': return 'bg-green-100 text-green-700';
            case 'Planning': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <ResponsiveLayout showRightSidebar={false} fullWidth={true}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Projects</h1>
                        <p className="text-slate-500 mt-1 font-medium text-lg">Manage and track your community initiatives</p>
                    </div>
                </div>

                {/* Filters & Stats */}
                <div className="flex flex-col xl:flex-row gap-6 mb-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="relative flex-1 group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search size={22} className="text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="pl-14 w-full px-6 py-4 rounded-2xl border-slate-200 bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
                        {['All', 'Active', 'Completed', 'Planning'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-6 py-3.5 rounded-2xl font-bold transition-all whitespace-nowrap active:scale-95 ${statusFilter === status
                                    ? 'bg-slate-800 text-white shadow-lg shadow-slate-800/20 ring-2 ring-slate-800 ring-offset-2'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                        <div
                            key={project.id}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col animate-in slide-in-from-bottom-8 fill-mode-both"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Project Image */}
                            <div className="h-64 overflow-hidden relative">
                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                                />
                                <div className="absolute top-4 right-4 z-20">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md border border-white/20 ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 z-20">
                                    <div className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm text-xs font-bold text-violet-700 shadow-lg flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
                                        {project.category}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-7 flex-1 flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-extrabold text-slate-800 leading-tight mb-3 line-clamp-1 group-hover:text-violet-700 transition-colors">{project.title}</h3>
                                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">{project.description}</p>
                                </div>

                                {/* Progress Bar */}
                                {project.status === 'Active' && (
                                    <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                                            <span>Progress</span>
                                            <span className="text-violet-600">{project.progress || 0}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mb-3">
                                            <div
                                                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                                                style={{ width: `${project.progress || 0}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-500 font-bold">
                                            <span>Target: ₹{(project.target_amount / 1000).toFixed(0)}k</span>
                                            <span className="text-green-600">Raised: ₹{(project.amount_raised / 1000).toFixed(0)}k</span>
                                        </div>
                                    </div>
                                )}

                                {/* Metrics Compact */}
                                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-slate-500 mb-6 font-medium">
                                    <div className="flex items-center gap-2 group/icon">
                                        <div className="p-1.5 rounded-full bg-slate-100 text-slate-400 group-hover/icon:bg-violet-100 group-hover/icon:text-violet-600 transition-colors">
                                            <MapPin size={14} />
                                        </div>
                                        <span className="truncate">{project.city}</span>
                                    </div>
                                    <div className="flex items-center gap-2 group/icon">
                                        <div className="p-1.5 rounded-full bg-slate-100 text-slate-400 group-hover/icon:bg-violet-100 group-hover/icon:text-violet-600 transition-colors">
                                            <Users size={14} />
                                        </div>
                                        <span>{project.teamSize} Member Team</span>
                                    </div>
                                    <div className="flex items-center gap-2 col-span-2 group/icon">
                                        <div className="p-1.5 rounded-full bg-slate-100 text-slate-400 group-hover/icon:bg-violet-100 group-hover/icon:text-violet-600 transition-colors">
                                            <Calendar size={14} />
                                        </div>
                                        <span>Launched {new Date(project.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                {/* Social Stats & Actions */}
                                <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between gap-3">
                                    <div className="flex gap-3 w-full">
                                        <button
                                            onClick={() => handleEditClick(project)}
                                            className="flex-1 py-3.5 rounded-xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:border-violet-600 hover:text-violet-600 transition-all flex items-center justify-center gap-2 active:scale-95 bg-white"
                                        >
                                            <Edit size={18} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleShare(project)}
                                            className="flex-1 py-3.5 rounded-xl bg-violet-50 text-violet-700 font-bold text-sm hover:bg-violet-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 group/btn border-2 border-transparent"
                                        >
                                            <Share2 size={18} className="transition-transform group-hover/btn:rotate-12" />
                                            Share Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Edit Modal */}
                {editingProject && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setEditingProject(null)} />

                        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-slate-800">Edit Project</h2>
                                        <p className="text-slate-500 font-medium text-sm mt-1">Update key details for {editingProject.title}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditingProject(null)}
                                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateProject} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Raised Amount (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-700"
                                            value={editForm.amount_raised}
                                            onChange={(e) => setEditForm({ ...editForm, amount_raised: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                                        <select
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-700 bg-white"
                                            value={editForm.status}
                                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Progress (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-700"
                                            value={editForm.progress}
                                            onChange={(e) => setEditForm({ ...editForm, progress: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Team Size</label>
                                        <input
                                            type="number"
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-700"
                                            value={editForm.teamSize}
                                            onChange={(e) => setEditForm({ ...editForm, teamSize: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Launch Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-slate-700"
                                            value={editForm.created_at}
                                            onChange={(e) => setEditForm({ ...editForm, created_at: e.target.value })}
                                        />
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setEditingProject(null)}
                                            className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-3.5 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Save size={18} />
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ResponsiveLayout>
    );
};

export default ProjectsPage;