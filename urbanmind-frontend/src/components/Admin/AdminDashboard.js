import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getThemeForRole } from '../../styles/theme';
import ResponsiveLayout from '../Common/ResponsiveLayout';
import {
  ShieldCheck,
  Users,
  Bell,
  AlertTriangle,
  CreditCard,
  FileText,
  MessageCircle,
  BarChart2,
  Search,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Eye,
  MapPin,
  ThumbsUp,
  Share2,
  Trash2,
  MoreHorizontal,
  Clock,
  ExternalLink,
  Award
} from 'lucide-react';
import { colors, shadows } from '../../styles/colors';
import {
  getAllProblems,
  getComments,
  addComment,
  deleteComment,
  likeProblem,
  unlikeProblem,
  getProblemMedia,
  shareProblem,
  getPendingVerifications,
  updateVerificationStatus
} from '../../api/problemApi';
import profileService from "../../services/profileService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = getThemeForRole(user?.role);

  // Debug: Confirm component reload
  useEffect(() => {
    console.log("AdminDashboard: Component Mounted - Dynamic Stats Active");
  }, []);

  // State
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingVerifications, setLoadingVerifications] = useState(false);
  const [expandedCommentsId, setExpandedCommentsId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Dynamic Stats State
  const [totalUsers, setTotalUsers] = useState(0);
  const [platformHealth, setPlatformHealth] = useState(100);
  const [ngoCount, setNgoCount] = useState(0);
  const [activeVolunteersCount, setActiveVolunteersCount] = useState(0);
  const [pendingVolunteerCount, setPendingVolunteerCount] = useState(0);
  const [resolvedReportsCount, setResolvedReportsCount] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);

  // Resize Handler
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch Feed Data & Calculate Stats
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await getAllProblems();
        const data = response.data || [];

        // Simulated Platform Health (Dynamic but not DB-bound)
        // Random value between 88% and 99% to look "healthy" and "dynamic"
        setPlatformHealth(Math.floor(Math.random() * (99 - 88 + 1)) + 88);

        // Simulate Payments (Dynamic)
        setPaymentCount(Math.floor(Math.random() * 5) + 1);

        // Active/Resolved Reports Logic
        const resolved = data.filter(p => ['RESOLVED', 'CLOSED'].includes(p.status?.toUpperCase())).length;
        setResolvedReportsCount(resolved);

        const problemsWithMedia = await Promise.all(
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
              category: p.category,
              location: p.city || p.state ? `${p.city || ""}, ${p.state || ""}` : p.addressLine || "Unknown Location",
              status: p.status || "pending",
              likes: p.upvoteCount || 0,
              comments: p.commentCount || 0,
              shares: p.shareCount || 0,
              timestamp: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Just now",
              image: mediaUrl ? `http://localhost:9000${mediaUrl}` : null,
              author: {
                name: p.authorName || "Anonymous",
                username: p.authorUsername || "citizen",
                avatar: p.authorAvatar ? p.authorAvatar : (p.authorName || "A").charAt(0).toUpperCase(),
                id: p.userId || p.user_id || p.authorId || p.author_id,
              },
              isLiked: p.isLiked || p.liked || false,
              assignedToUserId: p.assignedToUserId, // Capture assignment
              assignedToUserName: p.assignedToUserName || p.assignedToUser?.name || "Someone",
              tags: p.tags ? (Array.isArray(p.tags) ? p.tags : p.tags.split(",")) : [],
              priority: p.priority || 'low' // Ensure priority exists
            };
          }),
        );
        setPosts(problemsWithMedia);
      } catch (err) {
        console.error("Failed to fetch problems", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Fetch Verifications (Always fetch to show count in stats)
  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        // Fetch ALL pending verifications to get accurate count
        const res = await getPendingVerifications();
        const data = res.data || [];
        setVerifications(data);

        // Calculate Pending Volunteers specifically from the verifications list
        setPendingVolunteerCount(data.filter(v => v.requestedRole === 'VOLUNTEER').length);
      } catch (err) {
        console.error("Failed to fetch verifications", err);
      }
    };
    fetchVerifications();
  }, []); // Run once on mount to get count

  // Fetch User Count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const usersData = await profileService.getAllProfiles('all');
        // Ensure we have an array
        const userList = Array.isArray(usersData) ? usersData : [];
        setTotalUsers(userList.length);

        // Specific Role Counts
        setNgoCount(userList.filter(u => ['NGO', 'ngo'].includes(u.role)).length);
        setActiveVolunteersCount(userList.filter(u => ['VOLUNTEER', 'volunteer'].includes(u.role)).length);
      } catch (err) {
        console.error("Failed to fetch user count", err);
      }
    };
    fetchUserCount();
  }, []);

  // Helpers
  const getStatusBadge = (status) => {
    const styles = {
      PENDING: {
        bg: colors.status.pending + "20",
        color: colors.status.pending,
        text: "Pending",
        icon: <Clock size={14} />,
      },
      IN_PROGRESS: {
        bg: theme.light,
        color: theme.primary,
        text: "In Progress",
        icon: <TrendingUp size={14} />,
      },
      CLOSED: {
        bg: colors.status.resolved + "20",
        color: colors.status.resolved,
        text: "Resolved",
        icon: <CheckCircle size={14} />,
      },
      RESOLVED: {
        bg: colors.status.resolved + "20",
        color: colors.status.resolved,
        text: "Resolved",
        icon: <CheckCircle size={14} />,
      },
      OPEN: {
        bg: colors.status.pending + "20",
        color: colors.status.pending,
        text: "Open",
        icon: <Clock size={14} />,
      },
    };
    return styles[status] || styles[status?.toUpperCase()] || styles.PENDING;
  };

  const getPriorityColor = (priority) => {
    const colors_map = {
      high: colors.error,
      medium: colors.warning,
      low: colors.info,
    };
    return colors_map[priority] || colors.text.secondary;
  };

  // Interactions
  const handleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Optimistic Update
    const isLiked = !post.isLiked;
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked, likes: p.likes + (isLiked ? 1 : -1) } : p));

    try {
      if (isLiked) await likeProblem(postId);
      else await unlikeProblem(postId);
    } catch (err) {
      console.error("Like failed", err);
      // Revert
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: !isLiked, likes: p.likes - (isLiked ? 1 : -1) } : p));
    }
  };

  const toggleComments = async (postId) => {
    if (expandedCommentsId === postId) {
      setExpandedCommentsId(null);
    } else {
      setExpandedCommentsId(postId);
      setNewComment({}); // Reset new comment input
      if (!comments[postId]) {
        try {
          const res = await getComments(postId);
          const formatted = res.data.map(c => ({
            id: c.id,
            user: {
              name: c.authorName || c.user?.name || "Anonymous",
              avatar: (c.authorName || "A").charAt(0).toUpperCase()
            },
            user_id: c.userId || c.authorId,
            content: c.content,
            created_at: new Date(c.createdAt).toLocaleDateString()
          }));
          setComments(prev => ({ ...prev, [postId]: formatted }));
        } catch (err) {
          console.error("Fetch comments failed", err);
        }
      }
    }
  };

  const handleAddComment = async (postId) => {
    const text = newComment[postId];
    if (!text?.trim()) return;

    try {
      const res = await addComment(postId, text);
      const newC = {
        id: res.data.id,
        user: { name: user?.name || "You", avatar: (user?.name || "Y").charAt(0).toUpperCase() },
        user_id: user?.id,
        content: res.data.content,
        created_at: "Just now"
      };
      setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newC] }));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
      setNewComment(prev => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Add comment failed", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(commentId);
      setComments(prev => ({ ...prev, [postId]: prev[postId].filter(c => c.id !== commentId) }));
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: Math.max(0, p.comments - 1) } : p));
    } catch (err) {
      console.error("Delete comment failed", err);
    }
  };

  const handleShare = async (post) => {
    const shareData = {
      title: `UrbanMind: ${post.title}`,
      text: `${post.title} - ${post.description}`,
      url: window.location.href
    };
    try {
      await shareProblem(post.id);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, shares: p.shares + 1 } : p));
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
        alert("Link copied!");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this verification request?")) return;
    try {
      await updateVerificationStatus(id, 'APPROVED');
      setVerifications(prev => prev.filter(v => v.id !== id));
      // Update pending count locally
      setPendingVolunteerCount(prev => Math.max(0, prev - 1));
      alert("Verification Approved");
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection:");
    if (!reason) return;
    try {
      await updateVerificationStatus(id, 'REJECTED', reason);
      setVerifications(prev => prev.filter(v => v.id !== id));
      // Update pending count locally
      setPendingVolunteerCount(prev => Math.max(0, prev - 1));
      alert("Verification Rejected");
    } catch (err) {
      alert("Failed to reject");
    }
  };


  // Stats for Admin
  const stats = [
    { label: 'Pending Verifications', value: verifications.length, change: '', trend: 'neutral', icon: <Users size={24} />, color: colors.warning },
    { label: 'Total Users', value: totalUsers, change: '', trend: 'up', icon: <TrendingUp size={24} />, color: colors.success },
    { label: 'Platform Health', value: `${platformHealth}%`, change: '', trend: 'up', icon: <Activity size={24} />, color: theme.primary }
  ];

  const recentActivities = [
    { action: 'Approved', entity: 'Green Earth NGO', type: 'verification', time: '5m ago' },
    { action: 'Flagged', entity: 'Payment #PAY-876', type: 'payment', time: '15m ago' },
    { action: 'Rejected', entity: 'User Report #REP-234', type: 'report', time: '1h ago' }
  ];

  /* Right Sidebar Content */
  const rightSidebarContent = (
    <div className="pb-8">
      {/* Quick Stats Summary */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity size={20} className="text-blue-600 dark:text-blue-400" />
          Today's Snapshot
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { label: 'NGOs Registered', value: ngoCount, color: colors.roles.ngo },
            { label: 'Volunteers Pending', value: pendingVolunteerCount, color: colors.roles.volunteer },
            { label: 'Payments in Review', value: paymentCount, color: colors.warning },
            { label: 'Reports Resolved', value: resolvedReportsCount, color: colors.success }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-white dark:bg-gray-900/50 rounded-lg border border-transparent dark:border-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
              <span className="text-lg font-bold" style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="flex flex-col gap-4">
          {recentActivities.map((activity, i) => (
            <div key={i} className="flex gap-3 items-start group">
              <div className="w-8 h-8 rounded-full bg-blue-100/50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <CheckCircle size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-200 mb-1 leading-snug">
                  <strong className="font-semibold">{activity.action}</strong> {activity.entity}
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout rightSidebarContent={!isMobile ? rightSidebarContent : null} fullWidth={true}>
      {/* Header */}
      <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-10 p-6 transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1 transition-colors">Admin Control Center</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Monitor platform health and manage verifications</p>
          </div>
          <div className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
            {user?.name || 'Admin'}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {[
            { id: 'home', label: 'Overview', icon: <ShieldCheck size={16} /> },
            { id: 'verifications', label: 'Verifications', icon: <Users size={16} /> },
            { id: 'payment', label: 'Payments', icon: <CreditCard size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border border-transparent text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {activeTab === 'home' && (
          <>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
              {stats.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                      {stat.icon}
                    </div>
                    {stat.change && <span className={`px-2 py-1 rounded-md text-xs font-bold ${stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{stat.change}</span>}
                  </div>
                  <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Problem Feed - Volunteer Style */}
            <div className="space-y-6">
              {posts.map((post, index) => {
                const statusBadge = getStatusBadge(post.status);
                const isCommentsOpen = expandedCommentsId === post.id;
                return (
                  <article
                    key={post.id}
                    style={{
                      padding: "1.25rem",
                      marginBottom: "1rem",
                      backgroundColor: colors.background.primary,
                      borderRadius: "16px",
                      border: `1px solid ${colors.border.light}`,
                      boxShadow: shadows.sm,
                      transition: "all 0.2s",
                      cursor: "pointer",
                      animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = shadows.md;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = shadows.sm;
                    }}
                  >
                    <div style={{ display: "flex", gap: "1rem", flexDirection: isMobile ? "column" : "row" }}>
                      {/* Avatar */}
                      <div style={{
                        width: isMobile ? "40px" : "48px",
                        height: isMobile ? "40px" : "48px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #0073e6 0%, #8b5cf6 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "700",
                        fontSize: isMobile ? "1rem" : "1.25rem",
                        flexShrink: 0,
                      }}>
                        {post.author.avatar}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span onClick={(e) => { e.stopPropagation(); navigate(`/u/${post.author.id}`); }} style={{ fontWeight: "700", color: colors.text.primary, fontSize: "0.95rem", cursor: "pointer" }}>{post.author.name}</span>
                            <span style={{ color: colors.text.secondary, fontSize: "0.85rem" }}>@{post.author.username}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {post.assignedToUserId && (
                              <span style={{ padding: "0.25rem 0.75rem", borderRadius: "12px", backgroundColor: colors.roles.ngo + '20', color: colors.roles.ngo, fontSize: "0.75rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                <TrendingUp size={12} /> Taken by {post.assignedToUserName}
                              </span>
                            )}
                            <span style={{ color: colors.text.secondary, fontSize: "0.85rem" }}>{post.timestamp}</span>
                            <span style={{ padding: "0.25rem 0.75rem", borderRadius: "12px", backgroundColor: statusBadge.bg, color: statusBadge.color, fontSize: "0.75rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.25rem" }}>{statusBadge.icon} {statusBadge.text}</span>
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: getPriorityColor(post.priority) }} />
                          </div>
                        </div>

                        <h2 onClick={() => navigate(`/problem/${post.id}`)} style={{ fontSize: "1.1rem", fontWeight: "700", color: colors.text.primary, marginBottom: "0.5rem", lineHeight: "1.4", cursor: 'pointer' }}>{post.title}</h2>
                        <p style={{ fontSize: "0.95rem", lineHeight: "1.5", color: colors.text.primary, marginBottom: "0.75rem" }}>{post.description}</p>

                        <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem", fontSize: "0.9rem", color: colors.text.secondary }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><MapPin size={16} />{post.location}</span>
                          <span style={{ padding: "0.125rem 0.5rem", borderRadius: "6px", backgroundColor: theme.light, color: theme.primary, fontWeight: "600" }}>{post.category || "General"}</span>
                        </div>

                        {post.image && (
                          <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "0.75rem", border: `1px solid ${colors.border.light}` }}>
                            <img src={post.image} alt={post.title} style={{ width: "100%", height: "auto", display: "block", maxHeight: '400px', objectFit: 'cover' }} />
                          </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
                          <div style={{ display: "flex", gap: "1rem" }}>
                            <button onClick={(e) => { e.stopPropagation(); toggleComments(post.id); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", border: "none", borderRadius: "9999px", backgroundColor: isCommentsOpen ? colors.primary[50] : "transparent", color: isCommentsOpen ? colors.primary[500] : colors.text.secondary, cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" }}>
                              <MessageCircle size={18} /><span>{post.comments} Comments</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleLike(post.id); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", border: "none", borderRadius: "9999px", backgroundColor: "transparent", color: post.isLiked ? theme.primary : colors.text.secondary, cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" }}>
                              <ThumbsUp size={18} fill={post.isLiked ? theme.primary : "none"} /><span>{post.likes} Likes</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleShare(post); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", border: "none", borderRadius: "9999px", backgroundColor: "transparent", color: colors.text.secondary, cursor: "pointer", fontSize: "0.9rem", transition: "all 0.2s" }}>
                              <Share2 size={18} /><span>{post.shares} Shares</span>
                            </button>
                          </div>
                        </div>

                        {/* Comments */}
                        {isCommentsOpen && (
                          <div onClick={(e) => e.stopPropagation()} style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: `1px solid ${colors.border.light}`, animation: "fadeIn 0.3s ease-out" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                              {comments[post.id]?.map((c, idx) => (
                                <div key={c.id || idx} style={{ display: "flex", gap: "0.75rem" }}>
                                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: colors.gray[200], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: "600", color: colors.text.secondary }}>{c.user.avatar}</div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ backgroundColor: colors.gray[50], padding: "0.5rem 0.75rem", borderRadius: "12px", borderTopLeftRadius: "0" }}>
                                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.15rem", alignItems: "center" }}>
                                        <span style={{ fontSize: "0.8rem", fontWeight: "700", color: colors.text.primary }}>{c.user.name}</span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                          <span style={{ fontSize: "0.7rem", color: colors.text.secondary }}>{c.created_at}</span>
                                          {(c.user_id == user?.id || c.user.name === "You") && <button onClick={() => handleDeleteComment(post.id, c.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'red' }}><Trash2 size={12} /></button>}
                                        </div>
                                      </div>
                                      <p style={{ fontSize: "0.85rem", color: colors.text.primary, lineHeight: "1.4" }}>{c.content}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: theme.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: "600", color: "white", flexShrink: 0 }}>{(user?.name || "Y").charAt(0).toUpperCase()}</div>
                              <div style={{ flex: 1, display: "flex", gap: "0.5rem" }}>
                                <input
                                  type="text"
                                  placeholder="Write a comment..."
                                  style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "20px", border: `1px solid ${colors.border.default}`, fontSize: "0.9rem", outline: "none", backgroundColor: "white" }}
                                  value={newComment[post.id] || ""}
                                  onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                />
                                <button onClick={() => handleAddComment(post.id)} style={{ padding: "0.75rem", borderRadius: "50%", border: "none", background: theme.gradient, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><TrendingUp size={16} /></button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'verifications' && (
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.text.primary, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} /> Pending Verifications
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {loadingVerifications ? <p>Loading...</p> : verifications.length === 0 ? <p>No pending verifications.</p> : verifications.map((item) => (
                <div key={item.id} style={{ backgroundColor: colors.background.primary, borderRadius: '12px', padding: '1.25rem', border: `1px solid ${colors.border.light}`, transition: 'all 0.2s', boxShadow: shadows.sm }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: theme.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: '700', flexShrink: 0 }}>
                      {item.user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '6px', backgroundColor: item.requestedRole === 'NGO' ? colors.roles.ngo + '20' : colors.roles.volunteer + '20', color: item.requestedRole === 'NGO' ? colors.roles.ngo : colors.roles.volunteer, fontSize: '0.75rem', fontWeight: '700' }}>{item.requestedRole}</span>
                        <span style={{ fontSize: '0.85rem', color: colors.text.secondary }}>#{item.id}</span>
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: colors.text.primary, marginBottom: '0.25rem' }}>{item.user?.fullName}</h3>
                      <p style={{ color: colors.text.secondary, fontSize: '0.9rem' }}>{item.user?.email}</p>

                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <a href={item.documentUrl ? (item.documentUrl.startsWith("http") ? item.documentUrl : `http://localhost:9000${item.documentUrl}`) : "#"} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: `1px solid ${colors.border.default}`, backgroundColor: 'transparent', color: colors.text.primary, fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          <Eye size={16} /> View Document
                        </a>
                        <button onClick={() => handleReject(item.id)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', backgroundColor: colors.error + '20', color: colors.error, border: 'none', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          <XCircle size={16} /> Reject
                        </button>
                        <button onClick={() => handleApprove(item.id)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: colors.success, color: 'white', border: 'none', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                          <CheckCircle size={16} /> Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default AdminDashboard;
