// src/components/NGO/NGODashboard.js
// NGO dashboard with project management and team coordination

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ResponsiveLayout from "../Common/ResponsiveLayout";
import {
  MapPin,
  ThumbsUp,
  MessageCircle,
  Share2,
  Users,
  Briefcase,
  TrendingUp,
  DollarSign,
  Send,
  Trash2,
  Activity,
  Clock,
  CheckCircle,
  Award,
  Star,
  Trophy,
  Medal,
} from "lucide-react";
//import { colors, shadows } from '../../styles/colors'; // keeping commented as per request
import { getThemeForRole } from "../../styles/theme";
import ChatFloatingButton from "../Common/ChatFloatingButton";
import FloatingActionButton from "../Common/FloatingActionButton";
import profileService from "../../services/profileService";
import {
  getAllProblems,
  getComments,
  addComment,
  deleteComment,
  likeProblem,
  unlikeProblem,
  getProblemMedia,
  shareProblem,
  assignProblem,
  getAssignedProblems,
  resolveProblem,
} from "../../api/problemApi";

const NGODashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // State
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("feed");
  const [comments, setComments] = useState({}); // Stores comments by postId
  const [itemsLoading, setItemsLoading] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);
  const [expandedCommentsId, setExpandedCommentsId] = useState(null);
  const [newComment, setNewComment] = useState("");

  // Stats State
  const [profileStats, setProfileStats] = useState({
    activeProjects: 0,
    projectsCompleted: 0,
    livesImpacted: 0,
    fundsUtilized: 0,
    volunteers: 0,
    totalDonationsReceived: 0,
  });
  const goToProfile = (userId) => {
    navigate(`/u/${userId}`);
  };

  // Helper to process raw problem data
  const processProblems = async (data) => {
    return await Promise.all(
      data.map(async (p) => {
        let mediaUrl = null;
        try {
          const mediaRes = await getProblemMedia(p.id);
          if (mediaRes.data?.length > 0) {
            mediaUrl = mediaRes.data[0].mediaUrl;
          }
        } catch {}

        return {
          id: p.id,
          title: p.title,
          description: p.description,
          category: p.category || "General",
          location:
            p.city || p.state
              ? `${p.city || ""}, ${p.state || ""}`
              : p.addressLine || "Unknown Location",
          status: p.status || "pending",
          progress: p.progress || 0,
          team: p.teamCount || 0,
          volunteers: p.volunteerCount || 0,
          budget: `₹${p.budget || 0}`,
          spent: `₹${p.amountSpent || 0}`,
          timeline: p.deadline
            ? new Date(p.deadline).toLocaleDateString()
            : "Ongoing",
          likes: p.upvoteCount || 0,
          comments: p.commentCount || 0,
          shares: p.shareCount || 0,
          timestamp: p.createdAt
            ? new Date(p.createdAt).toLocaleDateString()
            : "Just now",
          image: mediaUrl ? `http://localhost:9000${mediaUrl}` : null,
          author: {
            name: p.authorName || "Anonymous",
            username: p.authorUsername || "citizen",
            avatar: p.authorAvatar
              ? p.authorAvatar
              : (p.authorName || "A").charAt(0).toUpperCase(),
            id:
              p.authorId ||
              p.userId ||
              p.user_id ||
              p.user?.id ||
              p.author?.id ||
              p.author_id ||
              p.User?.id ||
              null,
          },
          isLiked: p.isLiked || p.liked || false,
          tags: p.tags
            ? Array.isArray(p.tags)
              ? p.tags
              : p.tags.split(",")
            : [],
          donationRequired: p.donationRequired,
          requiredAmount: p.requiredAmount,
          assignedToUserId: p.assignedToUserId, // Capture assignment
          assignedToUserName:
            p.assignedToUserName ||
            p.assignedToUser?.name ||
            p.assignedToUser?.fullName ||
            "An Organization",
        };
      }),
    );
  };

  const fetchFeed = async () => {
    setItemsLoading(true);
    try {
      const response = await getAllProblems();
      const data = response.data || [];
      const mappedProjects = await processProblems(data);
      setProjects(mappedProjects);
    } catch (err) {
      console.error("Error fetching feed:", err);
    } finally {
      setItemsLoading(false);
    }
  };

  const fetchMyProjects = async () => {
    setItemsLoading(true);
    try {
      const response = await getAssignedProblems();
      const data = response.data || [];
      const mappedProjects = await processProblems(data);
      setMyProjects(mappedProjects);
    } catch (err) {
      console.error("Error fetching my projects:", err);
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "feed") {
      fetchFeed();
    } else {
      fetchMyProjects();
    }
  }, [activeTab]);

  const handleTakeAction = async (problemId) => {
    if (!window.confirm("Do you want to take ownership of this project?"))
      return;
    try {
      await assignProblem(problemId);
      if (activeTab === "feed") {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === problemId
              ? { ...p, status: "IN_PROGRESS", assignedToUserId: user?.id }
              : p,
          ),
        );
        alert("Project assigned! Redirecting to My Projects...");
        navigate("/ngo/projects");
      }
    } catch (error) {
      console.error("Failed to assign project", error);
      alert("Could not assign project. It might already be taken.");
    }
  };

  // 2. Fetch Profile Stats (Runs when user is available)
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      try {
        // Fetch specific NGO profile stats
        const profileData = await profileService.getProfile(user.role, user.id);
        const backendProfile = profileData.profile || {};

        let totalVolunteerCount = 0;
        try {
          const volunteersData =
            await profileService.getAllProfiles("volunteer");
          totalVolunteerCount = Array.isArray(volunteersData)
            ? volunteersData.length
            : 0;
        } catch {}

        setProfileStats({
          activeProjects: backendProfile.activeProjects || 0,
          projectsCompleted: backendProfile.projectsCompleted || 0,
          livesImpacted: backendProfile.livesImpacted || 0,
          fundsUtilized: backendProfile.fundsUtilized || 0,
          volunteers: totalVolunteerCount,
          totalDonationsReceived: backendProfile.totalDonationsReceived || 0,
        });
      } catch (err) {
        console.error("Error fetching profile stats:", err);
      }
    };

    fetchStats();
  }, [user]);

  // Handlers
  const handleLike = async (postId) => {
    const project = projects.find((p) => p.id === postId);
    if (!project) return;

    try {
      if (project.isLiked) {
        await unlikeProblem(postId);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, isLiked: false, likes: Math.max(0, p.likes - 1) }
              : p,
          ),
        );
      } else {
        await likeProblem(postId);
        setProjects((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, isLiked: true, likes: p.likes + 1 } : p,
          ),
        );
      }
    } catch (err) {
      console.error("Like interaction failed", err);
    }
  };

  const handlePostClick = async (postId) => {
    if (expandedCommentsId === postId) {
      setExpandedCommentsId(null);
      return;
    }
    setExpandedCommentsId(postId);

    if (!comments[postId]) {
      try {
        const res = await getComments(postId);
        const formatted = res.data.map((c) => ({
          id: c.id,
          text: c.content,
          author: {
            name: c.authorName || "Anonymous",
            username: c.authorUsername,
            avatar:
              c.authorAvatar || (c.authorName || "A").charAt(0).toUpperCase(),
            id: c.authorId || c.userId,
          },
          timestamp: new Date(c.createdAt).toLocaleDateString(),
        }));
        setComments((prev) => ({ ...prev, [postId]: formatted }));
      } catch (err) {
        console.error("Failed to load comments", err);
        setComments((prev) => ({ ...prev, [postId]: [] }));
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    try {
      const res = await addComment(postId, newComment);
      const newCommentObj = {
        id: res.data.id,
        text: res.data.content,
        author: {
          name: user?.name || "You",
          avatar: user?.name?.charAt(0) || "Y",
          id: user?.id,
        },
        timestamp: "Just now",
      };

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentObj],
      }));

      setProjects((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: p.comments + 1 } : p,
        ),
      );
      setNewComment("");
    } catch (err) {
      console.error("Add comment failed", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId),
      }));
      setProjects((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: Math.max(0, p.comments - 1) } : p,
        ),
      );
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete comment");
    }
  };

  const handleShare = async (project) => {
    const shareData = {
      title: `UrbanMind: ${project.title}`,
      text: `${project.title}\n${project.description}\n\nCheck this out on UrbanMind!`,
      url: window.location.href,
    };

    try {
      // Optimistic update
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, shares: p.shares + 1 } : p,
        ),
      );

      await shareProblem(project.id);

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`,
        );
        alert("Post content copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: {
        bg: "bg-amber-50",
        color: "text-amber-600",
        border: "border-amber-100",
        text: "Pending",
        icon: <Clock size={14} />,
      },
      IN_PROGRESS: {
        bg: "bg-blue-50",
        color: "text-blue-600",
        border: "border-blue-100",
        text: "In Progress",
        icon: <TrendingUp size={14} />,
      },
      CLOSED: {
        bg: "bg-green-50",
        color: "text-green-600",
        border: "border-green-100",
        text: "Resolved",
        icon: <CheckCircle size={14} />,
      },
      RESOLVED: {
        bg: "bg-green-50",
        color: "text-green-600",
        border: "border-green-100",
        text: "Resolved",
        icon: <CheckCircle size={14} />,
      },
      OPEN: {
        bg: "bg-amber-50",
        color: "text-amber-600",
        border: "border-amber-100",
        text: "Open",
        icon: <Clock size={14} />,
      },
    };
    return styles[status] || styles[status?.toUpperCase()] || styles.pending;
  };

  const RightSidebarContent = (
    <div className="pb-8 space-y-6">
      {/* Quick Stats Widget */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-in fade-in duration-500 delay-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
            <Activity size={20} className="stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">
            Impact Overview
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-3xl font-extrabold text-violet-600 mb-1">
              {profileStats.projectsCompleted}
            </div>
            <div className="text-sm font-semibold text-slate-500">
              Projects Completed
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-3xl font-extrabold text-blue-600 mb-1">
              {profileStats.livesImpacted}
            </div>
            <div className="text-sm font-semibold text-slate-500">
              Community Engagement
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-3xl font-extrabold text-green-600 mb-1">
              ₹{(profileStats.fundsUtilized / 100000).toFixed(2)}L
            </div>
            <div className="text-sm font-semibold text-slate-500">
              Total Funds Utilized
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const stats = [
    {
      label: "Active Projects",
      value: profileStats.activeProjects,
      icon: <Briefcase size={24} />,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
    {
      label: "Volunteers",
      value: profileStats.volunteers,
      icon: <TrendingUp size={24} />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Budget Utilized",
      value: `₹${(profileStats.fundsUtilized / 100000).toFixed(1)}L`,
      icon: <DollarSign size={24} />,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <ResponsiveLayout
      rightSidebarContent={RightSidebarContent}
      showRightSidebar={!isMobile}
      fullWidth={true}
    >
      <div className="max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                Community Reports
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">
                Manage and coordinate initiative responses
              </p>
            </div>
          </div>
        </div>
        <ChatFloatingButton hidden={fabOpen} />
        <FloatingActionButton onToggle={setFabOpen} />

        <div className="px-4 md:px-6 pb-20">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-in slide-in-from-top-4 duration-500">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-4 group-hover:scale-110 transition-transform`}
                >
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-800 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Only: Right Sidebar */}
          {isMobile && <div className="mb-8">{RightSidebarContent}</div>}

          {/* Projects Feed */}
          <div className="space-y-6">
            {itemsLoading ? (
              <div className="text-center py-20 text-slate-500">Loading...</div>
            ) : (
              (activeTab === "feed" ? projects : myProjects).map(
                (post, index) => {
                  const statusBadge = getStatusBadge(post.status);
                  const isExpanded = expandedCommentsId === post.id;
                  return (
                    <article
                      key={post.id}
                      className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group ${
                        isExpanded ? "ring-2 ring-blue-500/10" : ""
                      }`}
                    >
                      <div className="p-6 md:p-8">
                        <div className="flex gap-4 md:gap-6">
                          {/* Avatar */}
                          <div
                            className="flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation();
                              goToProfile(post.author.id);
                            }}
                          >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
                              {post.author.avatar}
                            </div>
                          </div>

                          {/* Post Content */}
                          <div className="flex-1 min-w-0">
                            {/* Author Info */}
                            <div className="flex items-start justify-between mb-3">
                              {/* Left: User Info */}
                              <div className="flex flex-col">
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    goToProfile(post.author.id);
                                  }}
                                  className="font-bold text-slate-900 text-base cursor-pointer hover:text-blue-600 transition-colors"
                                >
                                  {post.author.name}
                                </span>
                                <span className="text-slate-400 text-sm font-medium">
                                  @{post.author.username}
                                </span>
                              </div>

                              {/* Right: Date & Status */}
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded-lg">
                                  {post.timestamp}
                                </span>
                                <div
                                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border ${statusBadge.bg} ${statusBadge.color} ${statusBadge.border}`}
                                >
                                  {statusBadge.icon}
                                  {statusBadge.text}
                                </div>
                              </div>
                            </div>

                            {/* Post Title & Description */}
                            <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2 leading-tight transition-colors">
                              {post.title}
                            </h2>

                            <p className="text-slate-600 text-base leading-relaxed mb-4">
                              {post.description}
                            </p>

                            {/* Location & Category */}
                            <div className="flex flex-wrap gap-3 mb-4">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-sm font-medium">
                                <MapPin size={16} className="text-slate-400" />
                                {post.location}
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-sm font-bold">
                                {post.category || "General"}
                              </span>
                              {post.tags &&
                                post.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-bold"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                            </div>

                            {/* Post Image */}
                            {post.image ? (
                              <div className="rounded-2xl overflow-hidden mb-4 border border-slate-100 bg-slate-50 relative group/image">
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  className="w-full h-auto max-h-[400px] object-cover transition-transform duration-500 group-hover/image:scale-105"
                                />
                              </div>
                            ) : null}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePostClick(post.id);
                                }}
                                className={`group/btn flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                                  isExpanded
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                                }`}
                              >
                                <MessageCircle
                                  size={18}
                                  className={`transition-transform group-hover/btn:scale-110 ${isExpanded ? "fill-current" : ""}`}
                                />
                                <span className="text-sm font-medium">
                                  {post.comments} Comments
                                </span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLike(post.id);
                                }}
                                className={`group/btn flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                                  post.isLiked
                                    ? "text-blue-600"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                                }`}
                              >
                                <ThumbsUp
                                  size={18}
                                  className={`transition-transform group-hover/btn:scale-110 ${post.isLiked ? "fill-current" : ""}`}
                                />
                                <span className="text-sm font-medium">
                                  {post.likes} Likes
                                </span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(post);
                                }}
                                className="group/btn flex items-center gap-2 px-3 py-2 rounded-full text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all"
                              >
                                <Share2
                                  size={18}
                                  className="transition-transform group-hover/btn:scale-110"
                                />
                                <span className="text-sm font-medium">
                                  {post.shares} Shares
                                </span>
                              </button>

                              {/* Take Action Button (Only in Feed) */}
                              {activeTab === "feed" &&
                                !post.assignedToUserId &&
                                post.status !== "RESOLVED" &&
                                post.status !== "COMPLETED" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTakeAction(post.id);
                                    }}
                                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all font-medium text-sm shadow-md"
                                  >
                                    <Briefcase size={16} />
                                    Take Action
                                  </button>
                                )}

                              {/* Assigned To Badge (In Feed if assigned) */}
                              {activeTab === "feed" &&
                                post.assignedToUserId && (
                                  <div className="ml-auto px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm border border-indigo-100 flex items-center gap-2">
                                    <TrendingUp size={16} />
                                    <span>
                                      Taken by {post.assignedToUserName}
                                    </span>
                                  </div>
                                )}

                              {/* Resolve Button (Only in My Projects) - Placeholder for now if needed, or just Status Badge */}
                              {activeTab === "projects" && (
                                <div className="ml-auto px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm border border-blue-100 flex items-center gap-2">
                                  <TrendingUp size={16} />
                                  Active Project
                                </div>
                              )}
                            </div>

                            {/* Comments Section */}
                            {isExpanded && (
                              <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                {/* Comments List */}
                                <div className="space-y-4 pl-2 md:pl-0 mb-6">
                                  {comments[post.id] &&
                                  comments[post.id].length > 0 ? (
                                    comments[post.id].map((comment, idx) => {
                                      const isCurrentUser =
                                        comment.author?.name ===
                                        (user?.name || "You");
                                      return (
                                        <div
                                          key={comment.id || idx}
                                          className="flex gap-3 group/comment"
                                        >
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 mt-1">
                                            {(comment.author?.name || "A")
                                              .charAt(0)
                                              .toUpperCase()}
                                          </div>
                                          <div className="flex-1">
                                            <div className="bg-slate-50 rounded-2xl rounded-tl-none px-4 py-3 hover:bg-slate-100 transition-colors border border-slate-100/50">
                                              <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-bold text-slate-800">
                                                  {comment.author?.name ||
                                                    "Anonymous"}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-xs text-slate-400 font-medium">
                                                    {comment.timestamp}
                                                  </span>
                                                  {isCurrentUser && (
                                                    <button
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteComment(
                                                          post.id,
                                                          comment.id,
                                                        );
                                                      }}
                                                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover/comment:opacity-100"
                                                      title="Delete comment"
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
                                      );
                                    })
                                  ) : (
                                    <div className="text-center py-8">
                                      <p className="text-slate-400 text-sm font-medium">
                                        No comments yet. Be the first to join
                                        the discussion!
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* New Comment Input */}
                                <div className="flex gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                                    {user?.name?.charAt(0).toUpperCase() || "Y"}
                                  </div>
                                  <div className="flex-1 relative">
                                    <input
                                      type="text"
                                      placeholder="Write a comment..."
                                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                      value={newComment[post.id] || ""}
                                      onChange={(e) =>
                                        setNewComment((prev) => ({
                                          ...prev,
                                          [post.id]: e.target.value,
                                        }))
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
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
                                        <div className="w-4 h-4">
                                          <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <line
                                              x1="22"
                                              y1="2"
                                              x2="11"
                                              y2="13"
                                            ></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                          </svg>
                                        </div>
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {/* Donation Section */}
                                {post.donationRequired && (
                                  <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-orange-600 font-bold flex items-center gap-1">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="16"
                                          height="16"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <line
                                            x1="12"
                                            y1="1"
                                            x2="12"
                                            y2="23"
                                          ></line>
                                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                        </svg>
                                        Donation Requested
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3">
                                      This problem requires funding of{" "}
                                      <span className="font-bold text-slate-900">
                                        ₹{post.requiredAmount}
                                      </span>{" "}
                                      to be resolved. Your contribution can help
                                      fix this issue faster.
                                    </p>
                                    <div className="flex gap-2">
                                      <input
                                        type="number"
                                        placeholder="Enter amount (₹)"
                                        className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                      />
                                      <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">
                                        Donate
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                },
              )
            )}
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default NGODashboard;
