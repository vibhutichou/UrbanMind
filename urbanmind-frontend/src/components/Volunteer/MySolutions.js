
import React, { useState, useEffect } from "react";
import ResponsiveLayout from "../Common/ResponsiveLayout";
import {
    MapPin,
    ThumbsUp,
    MessageCircle,
    TrendingUp,
    Award,
    CheckCircle,
    Clock,
    Trash2,
    Camera
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    getAssignedProblems,
    resolveProblem,
    getComments,
    addComment,
    deleteComment,
    likeProblem,
    unlikeProblem,
    shareProblem
} from "../../api/problemApi";


const MySolutions = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [solutions, setSolutions] = useState([]);
    const [expandedPostId, setExpandedPostId] = useState(null);
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState({});

    useEffect(() => {
        const fetchSolutions = async () => {
            try {
                const response = await getAssignedProblems();
                // Transform API data to component state format
                const formatted = response.data.map(p => ({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    category: p.category,
                    location: p.city || p.addressLine || "Unknown",
                    status: p.status, // "IN_PROGRESS", "CLOSED", etc.
                    likes: p.upvoteCount || 0,
                    comments: p.commentCount || 0,
                    shares: p.shareCount || 0,
                    timestamp: new Date(p.createdAt).toLocaleDateString(),
                    image: p.coverImageUrl ? `http://localhost:9000${p.coverImageUrl}` : null,
                    author: {
                        name: p.authorName || "Anonymous",
                        username: p.authorUsername,
                        avatar: (p.authorName || "A").charAt(0).toUpperCase(),
                        id: p.authorId // Ensure this mapping is correct based on DTO
                    },
                    actionTaken: p.status === 'CLOSED' ? "Resolved" : "Working on it",
                    actionDate: "Ongoing"
                }));
                setSolutions(formatted);
            } catch (error) {
                console.error("Failed to fetch assigned problems", error);
            }
        };

        fetchSolutions();
    }, []);

    const handleResolve = async (problemId) => {
        try {
            await resolveProblem(problemId);
            setSolutions(prev => prev.map(p =>
                p.id === problemId ? { ...p, status: 'CLOSED', actionTaken: 'Resolved' } : p
            ));
        } catch (error) {
            console.error("Failed to resolve problem", error);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            CLOSED: { bg: 'bg-green-50', color: 'text-green-600', border: 'border-green-100', text: 'Resolved', icon: <CheckCircle size={14} /> },
            IN_PROGRESS: { bg: 'bg-blue-50', color: 'text-blue-600', border: 'border-blue-100', text: 'In Progress', icon: <Clock size={14} /> }
        };
        return styles[status] || styles.CLOSED;
    };

    const handleLike = (postId) => {
        setSolutions(solutions.map(post =>
            post.id === postId
                ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
    };

    const loadComments = (postId) => {
        // Mock comments
        const mockComments = [
            { id: 1, text: "Great work team!", author: { name: "Community Member" }, timestamp: "1h ago" },
            { id: 2, text: "Thanks for the quick action.", author: { name: "Resident" }, timestamp: "30m ago" }
        ];
        setComments(prev => ({ ...prev, [postId]: mockComments }));
    };

    const handlePostClick = (postId) => {
        if (expandedPostId === postId) {
            setExpandedPostId(null);
        } else {
            setExpandedPostId(postId);
            if (!comments[postId]) {
                loadComments(postId);
            }
        }
    };

    const handleAddComment = (postId) => {
        const commentText = newComment[postId];
        if (!commentText?.trim()) return;

        const newMockComment = {
            id: Date.now(),
            text: commentText,
            author: { name: user?.name || "You" },
            timestamp: "Just now"
        };

        setComments(prev => ({
            ...prev,
            [postId]: [...(prev[postId] || []), newMockComment]
        }));
        setNewComment(prev => ({ ...prev, [postId]: '' }));
    };

    const handleDeleteComment = (postId, commentId) => {
        setComments(prev => ({
            ...prev,
            [postId]: prev[postId].filter(c => c.id !== commentId)
        }));
    };

    // Right Sidebar Content
    const rightSidebarContent = (
        <div className="pb-8 space-y-6">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <Award size={20} className="text-blue-600" />
                    <h2 className="text-lg font-extrabold text-slate-800">Your Impact</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <span className="text-sm font-bold text-slate-600">Total Solutions</span>
                        <span className="text-xl font-extrabold text-blue-600">14</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <span className="text-sm font-bold text-slate-600">People Helped</span>
                        <span className="text-xl font-extrabold text-amber-500">250+</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <span className="text-sm font-bold text-slate-600">Hours Contributed</span>
                        <div className="flex items-center gap-1 text-green-600">
                            <Clock size={16} />
                            <span className="text-xl font-extrabold">48h</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <ResponsiveLayout rightSidebarContent={rightSidebarContent} fullWidth={true}>
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight ml-12 md:ml-0 flex items-center gap-2">
                    <TrendingUp className="text-blue-600" />
                    My Solutions
                </h1>
            </div>

            <div className="px-4 md:px-6 py-6 space-y-6 pb-20">
                {solutions.length > 0 ? (
                    solutions.map((post) => {
                        const statusBadge = getStatusBadge(post.status);
                        return (
                            <article
                                key={post.id}
                                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group"
                            >
                                <div className="p-6 md:p-8">
                                    <div className="flex gap-4 md:gap-6">
                                        {/* Action Icon */}
                                        <div className="flex-shrink-0">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white ${post.status === 'resolved' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                                                <TrendingUp size={24} />
                                            </div>
                                        </div>

                                        {/* Post Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Header */}
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.bg} ${statusBadge.color} ${statusBadge.border}`}>
                                                    {statusBadge.icon}
                                                    {statusBadge.text}
                                                </div>
                                                <span className="text-slate-400 text-sm font-medium ml-auto">{post.actionDate}</span>
                                            </div>

                                            {/* Title & Desc */}
                                            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2 leading-tight">
                                                {post.title}
                                            </h2>
                                            <p className="text-slate-600 text-base leading-relaxed mb-4">
                                                {post.description}
                                            </p>

                                            {/* Action Taken Box */}
                                            <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                                    Action Taken
                                                </div>
                                                <div className="text-sm font-bold text-slate-700">
                                                    {post.actionTaken}
                                                </div>
                                            </div>




                                            {/* Location & Category */}
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-sm font-medium">
                                                    <MapPin size={16} className="text-slate-400" />
                                                    {post.location}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-bold">
                                                    {post.category}
                                                </span>
                                            </div>

                                            {/* Original Post Image */}
                                            {post.image && (
                                                <div className="rounded-2xl overflow-hidden mb-4 border border-slate-100 bg-slate-50 relative group/image">
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-full h-auto max-h-[300px] object-cover transition-transform duration-500 group-hover/image:scale-105"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex items-center gap-6 pt-2 border-t border-slate-50">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLike(post.id);
                                                    }}
                                                    className={`flex items-center gap-2 transition-colors ${post.isLiked ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                                                >
                                                    <ThumbsUp size={18} className={post.isLiked ? 'fill-current' : ''} />
                                                    <span className="text-sm font-bold">{post.likes} Likes</span>
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePostClick(post.id);
                                                    }}
                                                    className={`flex items-center gap-2 transition-colors ${expandedPostId === post.id ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                                                >
                                                    <MessageCircle size={18} className={expandedPostId === post.id ? 'fill-current' : ''} />
                                                    <span className="text-sm font-bold">{post.comments} Comments</span>
                                                </button>

                                                {/* Update Progress Button -> Mark Resolved */}
                                                {post.status === 'IN_PROGRESS' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResolve(post.id);
                                                        }}
                                                        className="ml-auto flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors shadow-sm"
                                                    >
                                                        <CheckCircle size={16} /> Mark Resolved
                                                    </button>
                                                )}
                                            </div>

                                            {/* Comments Section */}
                                            {expandedPostId === post.id && (
                                                <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <div className="space-y-4 pl-0 md:pl-0 mb-6">
                                                        {comments[post.id] && comments[post.id].length > 0 ? (
                                                            comments[post.id].map((comment, idx) => (
                                                                <div key={comment.id || idx} className="flex gap-3 group/comment">
                                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 mt-1">
                                                                        {(comment.author?.name || 'A').charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="bg-slate-50 rounded-2xl rounded-tl-none px-4 py-3 hover:bg-slate-100 transition-colors border border-slate-100/50">
                                                                            <div className="flex items-center justify-between mb-1">
                                                                                <span className="text-sm font-bold text-slate-800">{comment.author?.name || 'Anonymous'}</span>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs text-slate-400 font-medium">{comment.timestamp}</span>
                                                                                    {comment.author?.name === (user?.name || "You") && (
                                                                                        <button
                                                                                            onClick={() => handleDeleteComment(post.id, comment.id)}
                                                                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                                                                        >
                                                                                            <Trash2 size={14} />
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                                                {comment.text}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-center py-4">
                                                                <p className="text-slate-400 text-sm font-medium">No comments yet.</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Input */}
                                                    <div className="flex gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                                                            {user?.name?.charAt(0).toUpperCase() || 'Y'}
                                                        </div>
                                                        <div className="flex-1 relative">
                                                            <input
                                                                type="text"
                                                                placeholder="Write a comment..."
                                                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                                                value={newComment[post.id] || ''}
                                                                onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                                        e.preventDefault();
                                                                        handleAddComment(post.id);
                                                                    }
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                            {newComment[post.id] && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleAddComment(post.id);
                                                                    }}
                                                                    className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                                                                >
                                                                    <div className="w-4 h-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></div>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <TrendingUp size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-600 mb-1">No Solutions Yet</h3>
                        <p className="text-slate-400">Start contributing to see your impact here!</p>
                    </div>
                )}
            </div>
        </ResponsiveLayout>
    );
};

export default MySolutions;
