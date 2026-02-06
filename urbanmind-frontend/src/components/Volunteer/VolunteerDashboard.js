// src/components/Volunteer/VolunteerDashboard.js
// Volunteer dashboard with crimson theme

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getThemeForRole } from "../../styles/theme";
import ResponsiveLayout from "../Common/ResponsiveLayout";

import {
  MapPin,
  ThumbsUp,
  MessageCircle,
  Share2,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  Trash2,
  Star,
} from "lucide-react";
import { colors, shadows } from "../../styles/colors";

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
  resolveProblem,
  getAssignedProblems,
} from "../../api/problemApi";
import profileService from "../../services/profileService";

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = getThemeForRole(user?.role?.toLowerCase());

  const [topVolunteers, setTopVolunteers] = useState([]);
  const [userRank, setUserRank] = useState(null); // Store global rank
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);

  // Fetch Leaderboard Data
  React.useEffect(() => {
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
            avatar: (v.fullName || v.username || "U").charAt(0).toUpperCase(),
            points: points,
            rating: v.ratingAverage || 0,
            isCurrentUser: v.id === user?.id,
          };
        });

        // Sort by points descending and take top 5
        processed.sort((a, b) => b.points - a.points);

        // Find current user's rank in the full list
        const myRankIndex = processed.findIndex((v) => v.isCurrentUser);
        if (myRankIndex !== -1) {
          setUserRank(myRankIndex + 1);
        } else {
          setUserRank(null);
        }

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

  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [mySolutions, setMySolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to process raw problem data (media, formatting)
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
          category: p.category,
          location:
            p.city || p.state
              ? `${p.city || ""}, ${p.state || ""}`
              : p.addressLine || "Unknown Location",
          status: p.status || "pending",
          assignedToUserId: p.assignedToUserId, // Capture assignment
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
              p.User?.id,
          },
          isLiked: p.isLiked || p.liked || false,
          assignedToUserName:
            p.assignedToUserName || p.assignedToUser?.name || "Someone",
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
  };

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const response = await getAllProblems();
      const data = response.data || [];
      const formatted = await processProblems(data);
      setPosts(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySolutions = async () => {
    setLoading(true);
    try {
      const response = await getAssignedProblems();
      const data = response.data || [];
      const formatted = await processProblems(data);
      setMySolutions(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === "feed") {
      fetchFeed();
    } else {
      fetchMySolutions();
    }
  }, [activeTab]);

  const handleTakeAction = async (problemId) => {
    try {
      await assignProblem(problemId);
      if (activeTab === "feed") {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === problemId ? { ...p, status: "IN_PROGRESS" } : p,
          ),
        );
        alert("Problem assigned! Check 'My Solutions'.");
      }
    } catch (error) {
      console.error("Failed to assign problem", error);
      alert("Could not assign problem. It might already be taken.");
    }
  };

  const handleResolve = async (problemId) => {
    try {
      await resolveProblem(problemId);
      if (activeTab === "solutions") {
        setMySolutions((prev) =>
          prev.map((p) =>
            p.id === problemId ? { ...p, status: "CLOSED" } : p,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to resolve problem", error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: {
        bg: colors.status.pending + "20",
        color: colors.status.pending,
        text: "Available",
        icon: <Clock size={14} />,
      },
      IN_PROGRESS: {
        bg: theme.light,
        color: theme.primary,
        text: "Working On It",
        icon: <TrendingUp size={14} />,
      },
      CLOSED: {
        bg: colors.status.resolved + "20",
        color: colors.status.resolved,
        text: "Completed",
        icon: <CheckCircle size={14} />,
      },
      RESOLVED: {
        bg: colors.status.resolved + "20",
        color: colors.status.resolved,
        text: "Completed",
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

  const handleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Optimistic Update
    const isLiked = !post.isLiked;
    setPosts(
      posts.map((p) =>
        p.id === postId
          ? { ...p, isLiked, likes: p.likes + (isLiked ? 1 : -1) }
          : p,
      ),
    );

    try {
      if (isLiked) {
        await likeProblem(postId);
      } else {
        await unlikeProblem(postId);
      }
    } catch (err) {
      console.error("Failed to update like status", err);
      // Revert if failed
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? { ...p, isLiked: !isLiked, likes: p.likes - (isLiked ? 1 : -1) }
            : p,
        ),
      );
    }
  };

  /* Right Sidebar Content extracted for reuse */
  const SidebarContent = () => (
    <div
      style={{
        width: "100%",
        padding: "0.5rem",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* Leaderboard Widget */}
      <div
        style={{
          backgroundColor: colors.gray[50],
          borderRadius: "16px",
          padding: "1rem",
          marginBottom: "1.5rem",
          animation: "fadeIn 0.5s ease-out",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <Award size={20} color={theme.primary} />
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "800",
              color: colors.text.primary,
            }}
          >
            Top Volunteers
          </h2>
        </div>
        {isLoadingLeaderboard ? (
          <div
            style={{
              padding: "1rem",
              textAlign: "center",
              color: colors.text.secondary,
            }}
          >
            Loading...
          </div>
        ) : topVolunteers.length > 0 ? (
          topVolunteers.map((volunteer, index) => (
            <div
              key={volunteer.id}
              onClick={() => navigate(`/u/${volunteer.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem",
                marginBottom: "0.5rem",
                backgroundColor: volunteer.isCurrentUser
                  ? colors.primary[50]
                  : "transparent", // Highlight current user
                borderRadius: "8px",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = volunteer.isCurrentUser
                  ? colors.primary[100]
                  : colors.gray[100];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = volunteer.isCurrentUser
                  ? colors.primary[50]
                  : "transparent";
              }}
            >
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "800",
                  color:
                    index === 0
                      ? "#FFD700"
                      : index === 1
                        ? "#C0C0C0"
                        : index === 2
                          ? "#CD7F32"
                          : colors.text.secondary,
                  width: "30px",
                }}
              >
                #{volunteer.rank}
              </div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background:
                    index === 0
                      ? "linear-gradient(135deg, #FFD700 0%, #FDB931 100%)"
                      : index === 1
                        ? "linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)"
                        : index === 2
                          ? "linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)"
                          : theme.gradient, // Fallback for > 3
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "700",
                }}
              >
                {volunteer.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    color: colors.text.primary,
                  }}
                >
                  {volunteer.name} {volunteer.isCurrentUser && "(You)"}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: colors.text.secondary,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <Award size={12} fill="#fb923c" color="#fb923c" />
                  {volunteer.points} pts
                  {/* <Star size={12} fill="#fb923c" color="#fb923c" /> */}
                  {/* {volunteer.rating} Rating */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              padding: "1rem",
              textAlign: "center",
              color: colors.text.secondary,
            }}
          >
            No volunteers yet.
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div
        style={{
          backgroundColor: colors.gray[50],
          borderRadius: "16px",
          padding: "1rem",
          animation: "fadeIn 0.5s ease-out 0.2s both",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "800",
            color: colors.text.primary,
            marginBottom: "1rem",
          }}
        >
          Your Impact
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                color: theme.primary,
              }}
            >
              45
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: colors.text.secondary,
              }}
            >
              Problems Solved
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                color: theme.primary,
              }}
            >
              12
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: colors.text.secondary,
              }}
            >
              Current Level
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                color: theme.primary,
              }}
            >
              8
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: colors.text.secondary,
              }}
            >
              Active Cases
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper to detect mobile screen
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [expandedCommentsId, setExpandedCommentsId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({}); // Stores comments for each post

  const toggleComments = async (postId) => {
    if (expandedCommentsId === postId) {
      setExpandedCommentsId(null);
    } else {
      setExpandedCommentsId(postId);
      setNewComment("");

      // Fetch comments if not already loaded or force refresh
      if (!comments[postId]) {
        try {
          const res = await getComments(postId);
          // Map backend comments to frontend structure if needed
          const formattedComments = res.data.map((c) => ({
            id: c.id,
            user_id: c.userId || c.user_id || c.authorId || c.author_id, // Robust mapping
            user: {
              name: c.authorName || c.user?.name || "Anonymous",
              avatar: (c.authorName || c.user?.name || "A")
                .charAt(0)
                .toUpperCase(),
            },
            content: c.content,
            created_at: new Date(c.createdAt).toLocaleDateString(),
          }));
          setComments((prev) => ({ ...prev, [postId]: formattedComments }));
        } catch (err) {
          console.error("Failed to fetch comments", err);
          setComments((prev) => ({ ...prev, [postId]: [] }));
        }
      }
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim()) return;

    try {
      const res = await addComment(postId, newComment);
      const newCommentObj = {
        id: res.data.id,
        user_id: user?.id,
        user: {
          name: user?.name || user?.fullName || "You",
          avatar: (user?.name || user?.fullName || "Y").charAt(0).toUpperCase(),
        },
        content: res.data.content,
        created_at: "Just now",
      };

      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentObj],
      }));

      // Update post comment count
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, comments: post.comments + 1 } : post,
        ),
      );

      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(commentId);

      // Update comments state
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId),
      }));

      // Update post comment count
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: Math.max(0, post.comments - 1),
            };
          }
          return post;
        }),
      );
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const handleShare = async (post) => {
    const shareData = {
      title: `UrbanMind: ${post.title}`,
      text: `Check out this issue: ${post.title} at ${post.location}`,
      url: window.location.href, // Or deep link to specific post if routing existed
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        // Persist share to backend
        await shareProblem(post.id);

        setPosts(
          posts.map((p) =>
            p.id === post.id ? { ...p, shares: p.shares + 1 } : p,
          ),
        );
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`,
        );
        alert("Link copied to clipboard!"); // Simple feedback

        await shareProblem(post.id); // Persist share

        setPosts(
          posts.map((p) =>
            p.id === post.id ? { ...p, shares: p.shares + 1 } : p,
          ),
        );
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Mock initial comments for demo
  React.useEffect(() => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => ({
        ...post,
        commentsList: post.commentsList || [
          {
            id: 101,
            problem_id: post.id,
            user_id: 201,
            user: { name: "Priya Verma", avatar: "P" },
            content: "This is a critical issue. Thanks for reporting!",
            created_at: "2h ago",
            is_edited: false,
          },
          {
            id: 102,
            problem_id: post.id,
            user_id: 202,
            user: { name: "Amit Patel", avatar: "A" },
            content: "I can join to help clean this up this weekend.",
            created_at: "1h ago",
            is_edited: false,
          },
        ],
      })),
    );
  }, []);

  return (
    <ResponsiveLayout
      fullWidth={true}
      rightSidebarContent={<SidebarContent />}
      showRightSidebar={!isMobile}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${colors.border.light}`,
          padding: "1rem 1.5rem",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: "800",
            color: colors.text.primary,
          }}
        >
          Available Problems
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            color: colors.text.secondary,
            marginTop: "0.25rem",
          }}
        >
          Find and solve community issues
        </p>
      </div>

      {/* Mobile Only: Leaderboard Section (Between Header/Stats and Posts) */}
      {isMobile && (
        <div style={{ borderBottom: `1px solid ${colors.border.light}` }}>
          <SidebarContent />
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          padding: "0 1rem",
          marginBottom: "1rem",
          display: "flex",
          gap: "1rem",
        }}
      >
        <button
          onClick={() => setActiveTab("feed")}
          style={{
            padding: "0.5rem 1rem",
            fontWeight: "bold",
            borderBottom:
              activeTab === "feed" ? `3px solid ${theme.primary}` : "none",
            color: activeTab === "feed" ? theme.primary : colors.text.secondary,
          }}
        >
          Feed
        </button>
        <button
          onClick={() => setActiveTab("solutions")}
          style={{
            padding: "0.5rem 1rem",
            fontWeight: "bold",
            borderBottom:
              activeTab === "solutions" ? `3px solid ${theme.primary}` : "none",
            color:
              activeTab === "solutions" ? theme.primary : colors.text.secondary,
          }}
        >
          My Solutions
        </button>
      </div>

      {/* Feed Posts */}
      {(activeTab === "feed" ? posts : mySolutions).map((post, index) => {
        const statusBadge = getStatusBadge(post.status);
        const isCommentsOpen = expandedCommentsId === post.id;

        return (
          <article
            key={post.id}
            style={{
              padding: "1.25rem",
              margin: "1rem", // Add margin around the card
              backgroundColor: colors.background.primary, // Ensure white background
              borderRadius: "16px", // Rounded corners
              border: `1px solid ${colors.border.light}`,
              boxShadow: shadows.sm, // Add subtle shadow
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
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              {/* Header on Mobile: Avatar + Name row */}
              {isMobile && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #0073e6 0%, #8b5cf6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "700",
                      fontSize: "1rem",
                      flexShrink: 0,
                    }}
                  >
                    {post.author.avatar}
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/u/${post.author.id}`);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      style={{
                        fontWeight: "700",
                        color: colors.text.primary,
                        display: "block",
                      }}
                    >
                      {post.author.name}
                    </span>
                    <span
                      style={{
                        color: colors.text.secondary,
                        fontSize: "0.85rem",
                      }}
                    >
                      @{post.author.username} · {post.timestamp}
                    </span>
                  </div>
                </div>
              )}

              {/* Desktop Avatar (Hidden on Mobile) */}
              {!isMobile && (
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #0073e6 0%, #8b5cf6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "700",
                    fontSize: "1.25rem",
                    flexShrink: 0,
                  }}
                >
                  {post.author.avatar}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Desktop Header Row (Hidden on Mobile) */}
                {!isMobile && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {/* Left: User Info */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/u/${post.author.id}`);
                        }}
                        style={{
                          fontWeight: "700",
                          color: colors.text.primary,
                          fontSize: "0.95rem",
                          cursor: "pointer",
                        }}
                      >
                        {post.author.name}
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/u/${post.author.id}`);
                        }}
                        style={{
                          color: colors.text.secondary,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                        }}
                      >
                        @{post.author.username}
                      </span>
                    </div>

                    {/* Right: Date & Status */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {post.assignedToUserId && (
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "12px",
                            backgroundColor: colors.primary[50],
                            color: theme.primary,
                            fontSize: "0.75rem",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <TrendingUp size={12} /> Taken by{" "}
                          {post.assignedToUserName}
                        </span>
                      )}
                      <span
                        style={{
                          color: colors.text.secondary,
                          fontSize: "0.85rem",
                        }}
                      >
                        {post.timestamp}
                      </span>

                      {/* Status Badge */}
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "12px",
                          backgroundColor: statusBadge.bg,
                          color: statusBadge.color,
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: getPriorityColor(post.priority),
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Mobile Status Row */}
                {isMobile && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "12px",
                        backgroundColor: statusBadge.bg,
                        color: statusBadge.color,
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      {statusBadge.icon}
                      {statusBadge.text}
                    </span>
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: getPriorityColor(post.priority),
                      }}
                    />
                  </div>
                )}

                <h2
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: colors.text.primary,
                    marginBottom: "0.5rem",
                    lineHeight: "1.4",
                  }}
                >
                  {post.title}
                </h2>

                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                    color: colors.text.primary,
                    marginBottom: "0.75rem",
                  }}
                >
                  {post.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    marginBottom: "0.75rem",
                    fontSize: "0.9rem",
                    color: colors.text.secondary,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <MapPin size={16} />
                    {post.location}
                  </span>
                  <span
                    style={{
                      padding: "0.125rem 0.5rem",
                      borderRadius: "6px",
                      backgroundColor: theme.light,
                      color: theme.primary,
                      fontWeight: "600",
                    }}
                  >
                    {post.category || "General"}
                  </span>
                  {post.tags &&
                    post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: "0.125rem 0.5rem",
                          borderRadius: "6px",
                          backgroundColor: colors.gray[100],
                          color: colors.text.secondary,
                          fontWeight: "600",
                          border: `1px solid ${colors.border.light}`,
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                </div>

                {post.image && (
                  <div
                    style={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      marginBottom: "0.75rem",
                      border: `1px solid ${colors.border.light}`,
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.01)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </div>
                )}

                {/* Volunteer Info */}
                {post.volunteer && (
                  <div
                    style={{
                      padding: "0.75rem",
                      backgroundColor: theme.light,
                      borderRadius: "8px",
                      marginBottom: "0.75rem",
                      fontSize: "0.9rem",
                      color: theme.primary,
                      fontWeight: "600",
                    }}
                  >
                    {post.volunteer === "You"
                      ? "✨ You are working on this"
                      : `👤 Handled by: ${post.volunteer}`}
                  </div>
                )}

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0.75rem",
                  }}
                >
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComments(post.id);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        border: "none",
                        borderRadius: "9999px",
                        backgroundColor: isCommentsOpen
                          ? colors.primary[50]
                          : "transparent",
                        color: isCommentsOpen
                          ? colors.primary[500]
                          : colors.text.secondary,
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        transition: "all 0.2s",
                        transform: isCommentsOpen ? "scale(1.05)" : "scale(1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          colors.primary[50];
                        e.currentTarget.style.color = colors.primary[500];
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isCommentsOpen) {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = colors.text.secondary;
                          e.currentTarget.style.transform = "scale(1)";
                        }
                      }}
                    >
                      <MessageCircle size={18} />
                      <span>{post.comments} Comments</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        border: "none",
                        borderRadius: "9999px",
                        backgroundColor: "transparent",
                        color: post.isLiked
                          ? theme.primary
                          : colors.text.secondary,
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.light;
                        e.currentTarget.style.color = theme.primary;
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = post.isLiked
                          ? theme.primary
                          : colors.text.secondary;
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <ThumbsUp
                        size={18}
                        fill={post.isLiked ? theme.primary : "none"}
                      />
                      <span>{post.likes} Likes</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(post);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        border: "none",
                        borderRadius: "9999px",
                        backgroundColor: "transparent",
                        color: colors.text.secondary,
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          colors.secondary[50];
                        e.currentTarget.style.color = colors.secondary[500];
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = colors.text.secondary;
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <Share2 size={18} />
                      <span>{post.shares} Shares</span>
                    </button>
                  </div>

                  {/* Take Action Button */}
                  {/* Take Action Button - Only for OPEN problems */}
                  {post.status === "OPEN" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTakeAction(post.id);
                      }}
                      style={{
                        padding: "0.5rem 1.25rem",
                        borderRadius: "9999px",
                        border: "none",
                        background: theme.gradient,
                        color: "white",
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                      }}
                    >
                      <TrendingUp size={16} strokeWidth={2.5} />
                      Take Action
                    </button>
                  )}
                  {/* Mark as Resolved Button (for assigned problems) */}
                  {activeTab === "solutions" &&
                    post.status === "IN_PROGRESS" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolve(post.id);
                        }}
                        style={{
                          marginTop: "1rem",
                          width: "100%",
                          padding: "0.75rem",
                          borderRadius: "12px",
                          border: "none",
                          background: colors.success || "#22c55e",
                          color: "white",
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <CheckCircle size={16} />
                        Mark as Resolved
                      </button>
                    )}
                </div>

                {/* Comment Section */}
                {isCommentsOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    style={{
                      marginTop: "1.5rem",
                      paddingTop: "1.5rem",
                      borderTop: `1px solid ${colors.border.light}`,
                      animation: "fadeIn 0.3s ease-out",
                    }}
                  >
                    {/* Previous Comments */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {comments[post.id] && comments[post.id].length > 0 ? (
                        comments[post.id].map((comment) => (
                          <div
                            key={comment.id}
                            style={{
                              display: "flex",
                              gap: "0.75rem",
                              group: "comment-group",
                            }}
                          >
                            <div
                              style={{
                                width: "28px",
                                height: "28px",
                                borderRadius: "50%",
                                backgroundColor: colors.gray[200],
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.8rem",
                                fontWeight: "600",
                                color: colors.text.secondary,
                              }}
                            >
                              {comment.user.avatar}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  backgroundColor: colors.gray[50],
                                  padding: "0.5rem 0.75rem",
                                  borderRadius: "12px",
                                  borderTopLeftRadius: "0",
                                  position: "relative",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "0.15rem",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "0.8rem",
                                      fontWeight: "700",
                                      color: colors.text.primary,
                                    }}
                                  >
                                    {comment.user.name}
                                  </span>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "0.7rem",
                                        color: colors.text.secondary,
                                      }}
                                    >
                                      {comment.created_at}
                                    </span>
                                    {(comment.user_id == (user?.id || 999) || // Loose equality to handle string/number mismatch
                                      comment.user.name === "You") && (
                                        <button
                                          onClick={() =>
                                            handleDeleteComment(
                                              post.id,
                                              comment.id,
                                            )
                                          }
                                          style={{
                                            border: "none",
                                            background: "none",
                                            cursor: "pointer",
                                            padding: "2px",
                                            color: colors.text.secondary,
                                            display: "flex",
                                            transition: "color 0.2s",
                                          }}
                                          onMouseEnter={(e) =>
                                            (e.currentTarget.style.color = "red")
                                          }
                                          onMouseLeave={(e) =>
                                          (e.currentTarget.style.color =
                                            colors.text.secondary)
                                          }
                                          title="Delete comment"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      )}
                                  </div>
                                </div>
                                <p
                                  style={{
                                    fontSize: "0.85rem",
                                    color: colors.text.primary,
                                    lineHeight: "1.4",
                                  }}
                                >
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p
                          style={{
                            color: colors.text.secondary,
                            fontSize: "0.9rem",
                            textAlign: "center",
                            padding: "1rem",
                          }}
                        >
                          No comments yet. Be the first to discuss!
                        </p>
                      )}
                    </div>

                    {/* Add Comment Input */}
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: theme.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          color: "white",
                          flexShrink: 0,
                        }}
                      >
                        {user?.name?.charAt(0) || "Y"}
                      </div>
                      <div style={{ flex: 1, position: "relative" }}>
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddComment(post.id)
                          }
                          style={{
                            width: "100%",
                            padding: "0.75rem 1rem",
                            paddingRight: "3rem", // space for send button
                            borderRadius: "24px",
                            border: `1px solid ${colors.border.default}`,
                            backgroundColor: colors.background.primary,
                            fontSize: "0.9rem",
                            outline: "none",
                            transition: "border-color 0.2s",
                          }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = theme.primary)
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = colors.border.default)
                          }
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={!newComment.trim()}
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            border: "none",
                            background: "none",
                            color: newComment.trim()
                              ? theme.primary
                              : colors.text.disabled,
                            cursor: newComment.trim() ? "pointer" : "default",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "4px",
                            transition: "color 0.2s",
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </ResponsiveLayout>
  );
};

export default VolunteerDashboard;