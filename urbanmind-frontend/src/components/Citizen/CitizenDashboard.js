import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ResponsiveLayout from "../Common/ResponsiveLayout";
import {
  MapPin,
  ThumbsUp,
  MessageCircle,
  Share2,
  TrendingUp,
  Trophy,
  Medal,
  Award,
  Star,
  Trash2,
  Clock,
  CheckCircle,
} from "lucide-react";

import {
  getAllProblems,
  getComments,
  addComment,
  deleteComment,
  likeProblem,
  unlikeProblem,
  getProblemMedia,
  shareProblem,
} from "../../api/problemApi";
import profileService from "../../services/profileService";

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [topVolunteers, setTopVolunteers] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  // Fetch Leaderboard Data
  useEffect(() => {
    const fetchTopVolunteers = async () => {
      try {
        const data = await profileService.getAllProfiles("VOLUNTEER");

        // Process and map data (Same logic as Leaderboard.js)
        const processed = data.map((v) => {
          const points =
            (v.problemsSolvedCount || 0) * 10 +
            (v.level || 0) * 50 +
            Math.round((v.ratingAverage || 0) * 20);
          return {
            id: v.id,
            name: v.fullName || v.username || "Volunteer",
            username: v.username || "volunteer",
            avatar: (v.fullName || v.username || "U").charAt(0).toUpperCase(),
            points: points,
            rating: v.ratingAverage || 0,
            isCurrentUser: v.id === user?.id,
          };
        });

        // Sort by points descending and take top 5
        processed.sort((a, b) => b.points - a.points);

        const top5 = processed.slice(0, 5).map((v, i) => ({
          ...v,
          rank: i + 1,
        }));

        setTopVolunteers(top5);
      } catch (error) {
        console.error("Failed to fetch dashboard leaderboard", error);
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };

    fetchTopVolunteers();
  }, [user]);

  const [posts, setPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await getAllProblems();
        const data = response.data || [];

        const problemsWithMedia = await Promise.all(
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
              category: p.category,
              location:
                p.city || p.state
                  ? `${p.city || ""}, ${p.state || ""}`
                  : p.addressLine || "Unknown Location",
              status: p.status || "pending",
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
                  p.userId ||
                  p.user_id ||
                  p.user?.id ||
                  p.authorId ||
                  p.author_id ||
                  p.User?.id, // Assuming userId is available in response for navigation
              },
              isLiked: p.isLiked || p.liked || false,
              tags: p.tags
                ? Array.isArray(p.tags)
                  ? p.tags
                  : p.tags.split(",")
                : [],
              donationRequired: p.donationRequired,
              requiredAmount: p.requiredAmount,
            };
          }),
        );

        setPosts(problemsWithMedia);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const trendingTopics = [
    { tag: "PotholeAlert", posts: "1.2K" },
    { tag: "CleanIndia", posts: "890" },
    { tag: "StrayAnimals", posts: "654" },
    { tag: "FoodDonation", posts: "432" },
  ];

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
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      if (post.isLiked) {
        // ✅ UNLIKE
        await unlikeProblem(postId);

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, isLiked: false, likes: Math.max(0, p.likes - 1) }
              : p,
          ),
        );
      } else {
        // ✅ LIKE
        await likeProblem(postId);

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, isLiked: true, likes: p.likes + 1 } : p,
          ),
        );
      }
    } catch (err) {
      console.error("Like/unlike failed:", err);
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

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(commentId);

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId),
      }));

      // Update comment count on post
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: Math.max(0, p.comments - 1) } : p,
        ),
      );
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete comment");
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    try {
      const res = await addComment(postId, commentText);

      const newCommentObj = {
        id: res.data.id,
        text: res.data.content,
        author: { name: user?.name || "You" },
        timestamp: "Just now",
      };

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentObj],
      }));

      setNewComment((prev) => ({ ...prev, [postId]: "" }));

      // Update comment count on post
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, comments: p.comments + 1 } : p,
        ),
      );
    } catch (err) {
      console.error("Add comment failed", err);
    }
  };

  const handleShare = async (post) => {
    const shareData = {
      title: `UrbanMind: ${post.title}`,
      text: `${post.title}\n${post.description}\n\nCheck this out on UrbanMind!`,
      url: window.location.href,
    };

    try {
      setPosts(
        posts.map((p) =>
          p.id === post.id ? { ...p, shares: p.shares + 1 } : p,
        ),
      );

      await shareProblem(post.id);

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}`,
        );
        alert("Post content copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Right Sidebar
  const rightSidebarContent = (
    <div className="pb-8 space-y-6">
      <div className="bg-slate-100 rounded-full p-4 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:bg-white border border-transparent focus-within:border-blue-500/50">
        <input
          type="text"
          placeholder="Search UrbanMind"
          className="w-full bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400"
        />
      </div>

      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-blue-600" />
          <h2 className="text-lg font-extrabold text-slate-800">
            Trending Topics
          </h2>
        </div>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="p-3 rounded-2xl hover:bg-slate-200/50 transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Trending in India
              </div>
              <div className="text-base font-bold text-slate-800 mb-0.5 group-hover:text-blue-600 transition-colors">
                #{topic.tag}
              </div>
              <div className="text-sm font-medium text-slate-500">
                {topic.posts} posts
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 animate-in fade-in slide-in-from-right-4 duration-500 delay-100">
        <div className="flex items-center gap-2 mb-4">
          <Award size={20} className="text-blue-600" />
          <h2 className="text-lg font-extrabold text-slate-800">
            Top Volunteers
          </h2>
        </div>
        <div className="space-y-3">
          {isLoadingLeaderboard ? (
            <div className="text-center p-4 text-slate-500">Loading...</div>
          ) : topVolunteers.length > 0 ? (
            topVolunteers.map((volunteer, index) => (
              <div
                key={volunteer.id}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 ${
                  index === 0 ? "bg-amber-50/50 border-amber-100/50" : ""
                }`}
                onClick={() => navigate(`/u/${volunteer.id}`)}
              >
                <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                  {volunteer.rank === 1 && (
                    <Trophy
                      size={24}
                      className="text-yellow-500 drop-shadow-sm"
                      fill="#eab308"
                    />
                  )}
                  {volunteer.rank === 2 && (
                    <Medal
                      size={24}
                      className="text-slate-400 drop-shadow-sm"
                      fill="#9ca3af"
                    />
                  )}
                  {volunteer.rank === 3 && (
                    <Medal
                      size={24}
                      className="text-orange-400 drop-shadow-sm"
                      fill="#fb923c"
                    />
                  )}
                  {volunteer.rank > 3 && (
                    <span className="text-lg font-bold text-slate-400">
                      #{volunteer.rank}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 text-sm truncate">
                    {volunteer.name}
                  </div>
                  <div className="text-xs font-medium text-slate-500 truncate">
                    @{volunteer.username}
                  </div>
                </div>

                <div className="flex items-center gap-1 font-extrabold text-slate-700 text-sm">
                  <Award size={14} className="text-yellow-400" fill="#facc15" />
                  {volunteer.points}
                </div>
                <div className="flex items-center gap-1 font-extrabold text-slate-700 text-sm">
                  <Star size={14} className="text-yellow-400" fill="#facc15" />
                  {volunteer.rating}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-slate-500">
              No volunteers yet.
            </div>
          )}
        </div>
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
          Home
        </h1>
      </div>

      <div className="px-4 md:px-6 py-6 space-y-6 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">Loading feed...</p>
          </div>
        ) : (
          posts.map((post, index) => {
            const statusBadge = getStatusBadge(post.status);
            const isExpanded = expandedPostId === post.id;
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
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
                        {post.author.avatar}
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      {/* Author Info */}
                      {/* Author Info */}
                      <div className="flex items-start justify-between mb-3">
                        {/* Left: User Info */}
                        <div className="flex flex-col">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/u/${post.author.id}`);
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
                                    <line x1="12" y1="1" x2="12" y2="23"></line>
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
                                to be resolved. Your contribution can help fix
                                this issue faster.
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
          })
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default CitizenDashboard;
