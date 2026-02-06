// src/components/Common/Profile/CommonProfilePage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ResponsiveLayout from "../ResponsiveLayout";
import AlertModal from "../AlertModal";
import {
  MapPin,
  Calendar,
  Briefcase,
  TrendingUp,
  MessageCircle,
  Share2,
  ThumbsUp,
  CheckCircle,
  Send,
  Trash2,
} from "lucide-react";
import { getThemeForRole } from "../../../styles/theme";
import profileService from "../../../services/profileService";
import { createChatRoom, getChatRooms } from "../../../services/chatService";

const CommonProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Alert State
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (title, message, type = "info") => {
    setAlertState({ isOpen: true, title, message, type });
  };

  // Local state for interactivity
  const [posts, setPosts] = useState([]);
  const [expandedCommentsId, setExpandedCommentsId] = useState(null);
  const [newComment, setNewComment] = useState("");

  // Fetch User Data from Backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getPublicProfile(userId);
        const user = data.user;
        const profile = data.profile;

        const mappedData = {
          id: user.id,
          name: user.fullName || user.username || "User",
          username: `@${user.username}`,
          role: user.role, // e.g. "VOLUNTEER"
          avatar: (user.fullName || user.username || "U")
            .charAt(0)
            .toUpperCase(),
          bio:
            profile.bio ||
            `Passionate ${user.role.toLowerCase()} contributing to UrbanMind.`, // Bio might not be in backend yet, using fallback
          location: `${user.city || ""}, ${user.state || ""}`,
          joinedDate: new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          }),
          metrics: [],
          badges: [],
        };

        // Role specific mappings
        if (user.role === "VOLUNTEER") {
          mappedData.metrics = [
            {
              label: "Level",
              value: profile.level || 0,
              icon: <TrendingUp size={20} />,
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
            {
              label: "Rating",
              value: profile.ratingAverage || "N/A",
              icon: <CheckCircle size={20} />,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "solved",
              value: profile.problemsSolvedCount || 0,
              icon: <Briefcase size={20} />,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
          ];
          if (profile.verificationStatus === "VERIFIED")
            mappedData.badges.push({ name: "Verified", icon: "✅" });
          if ((profile.level || 0) > 10)
            mappedData.badges.push({ name: "Top contributor", icon: "🏆" });
        } else if (user.role === "NGO") {
          mappedData.metrics = [
            {
              label: "Rating",
              value: profile.ratingAverage || 0,
              icon: <CheckCircle size={20} />,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Projects",
              value: profile.projectsCount || 0,
              icon: <Briefcase size={20} />,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Impact",
              value: "High", // Placeholder
              icon: <TrendingUp size={20} />,
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
          ];
          if (profile.isGovtVerified)
            mappedData.badges.push({ name: "Govt Verified", icon: "🏛️" });
        } else {
          // Citizen
          mappedData.metrics = [
            {
              label: "Reports",
              value: profile.reportCount || 0,
              icon: <TrendingUp size={20} />,
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
            {
              label: "Level",
              value: profile.level || 0,
              icon: <CheckCircle size={20} />,
              color: "text-green-600",
              bg: "bg-green-50",
            },
          ];
        }

        setUserData(mappedData);

        // Keep mock posts for now as we don't have a "get posts by user" endpoint yet visible
        setPosts([
          {
            id: 1,
            type: "Post",
            title: "Community Update",
            content: `${user.fullName} updated their profile.`,
            likes: 0,
            comments: 0,
            timestamp: "Just now",
            isLiked: false,
            commentsList: [],
          },
        ]);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleMessage = async () => {
    if (!user) {
      if (window.confirm("Please login to send a message. Go to login?")) {
        navigate("/login");
      }
      return;
    }
    if (user.id === userData.id) {
      showAlert(
        "Action Not Allowed",
        "You cannot chat with yourself",
        "warning",
      );
      return;
    }

    try {
      // 1. Check if chat room already exists
      const rooms = await getChatRooms(user.id);
      const existingRoom = rooms.find(
        (r) => r.user1Id === userData.id || r.user2Id === userData.id,
      );

      if (existingRoom) {
        navigate("/chats", { state: { roomId: existingRoom.id } });
      } else {
        // 2. Create new if not exists
        const newRoom = await createChatRoom(user.id, userData.id);
        navigate("/chats", { state: { roomId: newRoom.id } });
      }
    } catch (error) {
      console.error("Failed to start chat", error);
      // Fallback
      if (error.response && error.response.status === 200) {
        // Maybe it returned the room in a different duplicate error format?
        // Assuming if we fail here, we might just route to /chats generically
        navigate("/chats");
      } else {
        showAlert("Error", "Could not start chat. Please try again.", "error");
      }
    }
  };

  const handleShareProfile = async () => {
    const shareData = {
      title: `${userData.name}'s Profile`,
      text: `Check out ${userData.name} on UrbanMind!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showAlert("Success", "Profile link copied to clipboard!", "success");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const toggleComments = (postId) => {
    if (expandedCommentsId === postId) {
      setExpandedCommentsId(null);
    } else {
      setExpandedCommentsId(postId);
      setNewComment("");
    }
  };

  const handleAddComment = (postId) => {
    if (!newComment.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newCommentObj = {
            id: Date.now(),
            user: "You", // Mock user
            text: newComment,
            time: "Just now",
          };
          return {
            ...post,
            commentsList: [...(post.commentsList || []), newCommentObj],
            comments: post.comments + 1,
          };
        }
        return post;
      }),
    );
    setNewComment("");
  };

  const handleDeleteComment = (postId, commentId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsList: post.commentsList.filter((c) => c.id !== commentId),
            comments: Math.max(0, post.comments - 1),
          };
        }
        return post;
      }),
    );
  };

  if (loading) {
    return (
      <ResponsiveLayout showRightSidebar={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (!userData) return null;

  const theme = getThemeForRole(userData.role.toLowerCase());

  const getRoleBadgeColor = (role) => {
    // Fallback or use theme colors directly if preferred,
    // but for specific badges we might want to keep distinct colors
    // or just use the theme.light and theme.primary
    return { bg: theme.light, text: theme.primary };
  };

  const roleColors = getRoleBadgeColor(userData.role);

  return (
    <ResponsiveLayout showRightSidebar={true} fullWidth={true}>
      <div className="max-w-4xl mx-auto pb-20">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="h-32 relative" style={{ background: theme.gradient }}>
            <div className="absolute -bottom-12 left-8">
              <div
                className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-4xl font-bold"
                style={{ color: theme.primary }}
              >
                {userData.avatar}
              </div>
            </div>
          </div>
          <div className="pt-16 pb-8 px-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                  {userData.name}
                  <span
                    className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: roleColors.bg,
                      color: roleColors.text,
                    }}
                  >
                    {userData.role}
                  </span>
                </h1>
                <p className="text-slate-500 font-medium text-lg mt-1">
                  {userData.username}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleShareProfile}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                >
                  <Share2 size={18} />
                  Share Profile
                </button>
                <button
                  onClick={handleMessage}
                  disabled={user?.id === userData?.id}
                  className={`p-2.5 rounded-xl border border-slate-200 transition-all ${
                    user?.id === userData?.id
                      ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400"
                      : "hover:bg-slate-50 text-slate-600"
                  }`}
                  title={
                    user?.id === userData?.id
                      ? "You cannot chat with yourself"
                      : "Send Message"
                  }
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>

            <p className="mt-6 text-slate-600 text-lg leading-relaxed max-w-2xl">
              {userData.bio}
            </p>

            <div className="flex flex-wrap gap-6 mt-6 text-slate-500 font-medium text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                {userData.location}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                Joined {userData.joinedDate}
              </div>
              {userData.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100"
                >
                  <span>{badge.icon}</span>
                  {badge.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {userData.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default"
            >
              <div className={`p-3 rounded-xl ${metric.bg} ${metric.color}`}>
                {metric.icon}
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-800">
                  {metric.value}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  {metric.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 px-2">
            Recent Activity
          </h2>
          {posts.map((post) => {
            const isCommentsOpen = expandedCommentsId === post.id;
            return (
              <article
                key={post.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {userData.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">
                        {userData.name}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {post.timestamp} · {post.type}
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  {post.content}
                </p>

                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-2xl mb-4 border border-slate-100"
                  />
                )}

                <div className="flex items-center gap-6 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 font-bold text-sm transition-colors ${
                      post.isLiked
                        ? "text-violet-600"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <ThumbsUp
                      size={18}
                      className={post.isLiked ? "fill-current" : ""}
                    />
                    {post.likes}
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-2 font-bold text-sm transition-colors ${
                      isCommentsOpen
                        ? "text-blue-600"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <MessageCircle size={18} />
                    {post.comments}
                  </button>
                </div>

                {/* Comments Section */}
                {isCommentsOpen && (
                  <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-4 mb-6">
                      {post.commentsList && post.commentsList.length > 0 ? (
                        post.commentsList.map((comment, idx) => (
                          <div key={idx} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                              {comment.user.charAt(0)}
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-none p-3">
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-sm font-bold text-slate-800">
                                  {comment.user}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-slate-400">
                                    {comment.time}
                                  </span>
                                  {comment.user === "You" && (
                                    <button
                                      onClick={() =>
                                        handleDeleteComment(post.id, comment.id)
                                      }
                                      className="text-slate-400 hover:text-red-500 transition-colors"
                                      title="Delete comment"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-slate-600 text-sm">
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-slate-400 text-sm font-medium italic">
                          No comments yet.
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold shrink-0">
                        Y
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="w-full pl-4 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all placeholder:text-slate-400"
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleAddComment(post.id)
                          }
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={!newComment.trim()}
                          className="absolute right-1.5 top-1.5 p-1.5 rounded-full bg-violet-600 text-white disabled:bg-slate-200 disabled:text-slate-400 transition-colors"
                        >
                          <Send
                            size={14}
                            className={
                              newComment.trim() ? "translate-x-0.5" : ""
                            }
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default CommonProfilePage;
