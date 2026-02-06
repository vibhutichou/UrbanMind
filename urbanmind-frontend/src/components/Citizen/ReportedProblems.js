import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "../Common/ResponsiveLayout";
import { useAuth } from "../../context/AuthContext";
import { MapPin, ThumbsUp, MessageCircle, Share2, Trash2, Clock, CheckCircle, TrendingUp } from "lucide-react";
import {
  getMyProblems,
  getComments,
  addComment,
  deleteComment,
  getProblemMedia,
  likeProblem,
  unlikeProblem,
  shareProblem
} from "../../api/problemApi";

const ReportedProblems = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await getMyProblems();
        const data = response.data || [];

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
              location: p.addressLine || p.city || "Unknown Location",
              city: p.city,
              state: p.state,
              status: p.status || "pending",
              likes: p.upvoteCount || 0,
              comments: p.commentCount || 0,
              shares: p.shareCount || 0,
              timestamp: p.createdAt
                ? new Date(p.createdAt).toLocaleDateString()
                : "Just now",
              image: mediaUrl ? `http://localhost:9000${mediaUrl}` : null,
              author: {
                name: user.name || "You",
                username: user.email?.split("@")[0] || "citizen",
                avatar: (user.name || "Y").charAt(0).toUpperCase(),
                id: user.id,
              },
              isLiked: p.isLiked || p.liked || false,
              tags: p.tags ? (Array.isArray(p.tags) ? p.tags : p.tags.split(',')) : [],
              donationRequired: p.donationRequired,
              requiredAmount: p.requiredAmount
            };
          })
        );

        setPosts(problemsWithMedia);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [user]);

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

  // ✅ BACKEND CONNECTED LIKE
  const handleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
            ...p,
            isLiked: !p.isLiked,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          }
          : p
      )
    );

    try {
      const post = posts.find((p) => p.id === postId);
      if (post?.isLiked) {
        await unlikeProblem(postId);
      } else {
        await likeProblem(postId);
      }
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handlePostClick = async (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }

    setExpandedPostId(postId);

    if (!comments[postId]) {
      try {
        const res = await getComments(postId);
        const formatted = res.data.map((c) => ({
          id: c.id,
          text: c.content,
          author: {
            name: c.authorName || "Anonymous",
            username: c.authorUsername,
            avatar: c.authorAvatar,
            id: c.userId
          },
          timestamp: new Date(c.createdAt).toLocaleString(),
        }));

        setComments((prev) => ({ ...prev, [postId]: formatted }));
      } catch {
        setComments((prev) => ({ ...prev, [postId]: [] }));
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment[postId]?.trim()) return;

    const res = await addComment(postId, newComment[postId]);

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), {
        id: res.data.id,
        text: res.data.content,
        author: { id: user.id },
        timestamp: "Just now",
      }],
    }));

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: p.comments + 1 } : p
      )
    );

    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleDeleteComment = async (postId, commentId) => {
    await deleteComment(commentId);

    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].filter((c) => c.id !== commentId),
    }));

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: Math.max(0, p.comments - 1) }
          : p
      )
    );
  };
  const handleShare = async (post) => {
    const shareData = {
      title: `UrbanMind: ${post.title}`,
      text: `${post.title}\n${post.description}\n\nCheck this out on UrbanMind!`,
      url: window.location.href,
    };

    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, shares: p.shares + 1 } : p
        )
      );

      // Call backend
      await shareProblem(post.id);

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}`
        );
        // alert("Post content copied to clipboard!"); // User asked not to change other things, keeping flow minimal
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const rightSidebarContent = (
    <div className="pb-8 space-y-6">
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
        <h2 className="text-lg font-extrabold text-slate-800 mb-2">
          Track Your Reports
        </h2>
        <p className="text-sm text-slate-500">
          Here you can see the status of problems you have reported.
          <br />
          <br />
          Green means resolved, Blue is in progress, and Amber needs attention.
        </p>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout
      rightSidebarContent={rightSidebarContent}
      fullWidth={true}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight ml-12 md:ml-0">
          My Reported Problems
        </h1>
      </div>

      <div className="px-4 md:px-6 py-6 space-y-6 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">Loading your reports...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">
              You haven't reported any problems yet.
            </p>
            <button
              onClick={() => navigate("/citizen/report-problem")}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Report a Problem
            </button>
          </div>
        ) : (
          posts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            const statusBadge = getStatusBadge(post.status);

            return (
              <article
                key={post.id}
                className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md group ${isExpanded ? "ring-2 ring-blue-500/10" : ""
                  }`}
              >
                <div className="p-6 md:p-8">
                  <div className="flex gap-4 md:gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
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
                          <span className="font-bold text-slate-900 text-base">
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
                      <h2
                        className="text-lg md:text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer"
                        onClick={() => handlePostClick(post.id)}
                      >
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
                      {post.image && (
                        <div className="rounded-2xl overflow-hidden mb-4 border border-slate-100 bg-slate-50 relative group/image">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-auto max-h-[400px] object-cover transition-transform duration-500 group-hover/image:scale-105"
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-4 pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePostClick(post.id);
                          }}
                          className={`group/btn flex items-center gap-2 px-3 py-2 rounded-full transition-all ${isExpanded
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
                          className={`group/btn flex items-center gap-2 px-3 py-2 rounded-full transition-all ${post.isLiked
                            ? "bg-pink-50 text-pink-500"
                            : "text-slate-500 hover:bg-pink-50 hover:text-pink-500"
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
                                  comment.author?.id === user?.id;
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
                                  No comments yet. Be the first to join the
                                  discussion!
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
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default ReportedProblems;
