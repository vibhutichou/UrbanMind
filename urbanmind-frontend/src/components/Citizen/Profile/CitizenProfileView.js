// src/components/Citizen/CitizenProfile.js

import React, { useState, useEffect } from "react";
import { getThemeForRole } from "../../../styles/theme";
import ResponsiveLayout from "../../Common/ResponsiveLayout";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Edit,
  Trash2,
  Save,
  X,
  MessageCircle,
  Flag,
  ThumbsUp,
} from "lucide-react";
import { colors } from "../../../styles/colors";
import { useAuth } from "../../../context/AuthContext";
import profileService from "../../../services/profileService";

import { getMyProblems } from "../../../api/problemApi";

const CitizenProfile = () => {
  const { user } = useAuth();
  const theme = getThemeForRole(user?.role);

  const [currentView, setCurrentView] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    // Initial state can be empty or have sensible defaults
    name: "",
    username: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    bio: "",
    joinDate: "",

    // Stats
    problemsReported: 0,
    problemsResolved: 0,
    upvotesReceived: 0,
    commentsReceived: 0,

    categories: [],
    verificationStatus: "PENDING",
    memberSince: "",
    recentPosts: [],
    badges: [],
  });

  const [editForm, setEditForm] = useState({ ...profileData });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.role && user?.id) {
        try {
          const [profileResponse, problemsResponse] = await Promise.all([
            profileService.getProfile(user.role, user.id),
            getMyProblems(),
          ]);

          const { user: backendUser, profile: backendProfile } =
            profileResponse;
          const problems = problemsResponse.data || [];

          // Calculate category breakdown and stats from problems
          const categoryCounts = {};
          let totalUpvotes = 0;
          let totalComments = 0;

          problems.forEach((p) => {
            const cat = p.category || "Other";
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
            totalUpvotes += p.upvoteCount || 0;
            totalComments += p.commentCount || 0;
          });

          const categories = Object.keys(categoryCounts).map((cat) => ({
            name: cat,
            count: categoryCounts[cat],
          }));

          // Format recent posts
          const recentPosts = problems
            .map((p) => ({
              id: p.id,
              title: p.title,
              status: p.status || "pending",
              date: p.createdAt
                ? new Date(p.createdAt).toLocaleDateString()
                : "Just now",
              category: p.category,
            }))
            .slice(0, 3); // Show top 3 recent

          const mappedData = {
            name: backendUser.fullName || "",
            username: "@" + (backendUser.username || ""),
            email: backendUser.email || "",
            phone: backendUser.phone || "",

            // Address breakdown
            addressLine: backendUser.addressLine || "",
            city: backendUser.city || "",
            state: backendUser.state || "",
            country: backendUser.country || "",
            pincode: backendUser.pincode || "",

            bio: "", // Add bio if backend supports it, else keep empty or fetch from 'about' field

            // Map specific profile fields if they exist
            verificationStatus: backendProfile.verificationStatus || "PENDING",
            activeCases: backendProfile.activeCases || 0,
            problemsReported: backendProfile.reportCount || problems.length,
            problemsResolved: backendProfile.problemsSolvedCount || 0,
            upvotesReceived: totalUpvotes,
            commentsReceived: totalComments,

            // Use backend data or defaults if not available
            categories: categories,
            recentPosts: recentPosts,
            badges: [], // needs separate API
            profilePhotoUrl: backendUser.profilePhotoUrl || null,
          };

          // Format address
          const fullAddress = [
            backendUser.addressLine,
            backendUser.city,
            backendUser.state,
            backendUser.pincode,
          ]
            .filter(Boolean)
            .join(", ");

          if (fullAddress) mappedData.address = fullAddress;

          setProfileData((prev) => ({
            ...prev,
            ...mappedData,
          }));
          setEditForm((prev) => ({
            ...prev,
            ...mappedData,
          }));

          if (backendUser.profilePhotoUrl) {
            setProfileImage(backendUser.profilePhotoUrl);
          }
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleSaveEdit = async () => {
    try {
      const dataToSend = {
        ...editForm,
        fullName: editForm.name,
      };
      await profileService.updateProfile(user.role, user.id, dataToSend);
      setProfileData({ ...editForm });
      setIsEditing(false);
      setCurrentView("profile");
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone.",
      )
    ) {
      try {
        await profileService.deleteProfile(user.role, user.id);
        alert("Profile deleted successfully!");
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      } catch (error) {
        console.error("Failed to delete profile", error);
        alert("Failed to delete profile");
      }
    }
  };

  // PROFILE VIEW
  const renderProfileView = () => (
    <div className="px-0 md:px-8 pt-0 md:pt-8 w-full max-w-7xl mx-auto">
      {/* Header with Background */}
      <div
        className="relative mb-20 md:mb-24 rounded-none md:rounded-3xl p-6 md:p-8 pb-32 md:pb-40 overflow-visible"
        style={{ background: theme.gradient }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 pt-16 md:pt-0">
          <div className="text-white">
            <h1 className="text-2xl md:text-4xl font-extrabold mb-2 text-white">
              My Profile
            </h1>
            <p className="text-white/95 text-sm md:text-base">
              Manage your citizen information
            </p>
          </div>
        </div>

        {/* Profile Card Overlay */}
        <div className="absolute -bottom-16 md:-bottom-20 left-0 right-0 md:left-8 md:right-8 bg-white rounded-t-3xl rounded-b-none md:rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
          <div className="relative -mt-16 md:mt-0 shrink-0 z-10">
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-3xl md:text-5xl font-extrabold text-white border-4 border-white shadow-lg bg-center bg-cover"
              style={{
                background: profileImage
                  ? `url(${profileImage})`
                  : theme.gradient,
                backgroundImage: profileImage
                  ? `url(${profileImage})`
                  : theme.gradient,
              }}
            >
              {!profileImage && profileData.name.charAt(0)}
            </div>
            {profileData.verificationStatus === "VERIFIED" && (
              <div className="absolute bottom-1 right-1 bg-green-500 rounded-full p-1.5 border-[3px] border-white flex items-center justify-center">
                <CheckCircle
                  size={window.innerWidth < 768 ? 16 : 20}
                  className="w-4 h-4 md:w-5 md:h-5 text-white"
                />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left mt-2 md:mt-0 w-full">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 drop-shadow-sm mb-2">
              {profileData.name}
            </h2>

            <p className="text-gray-500 text-sm md:text-base mb-3">
              {/* Username hidden */}
            </p>

            <p className="text-gray-800 leading-relaxed mb-4 max-w-2xl mx-auto md:mx-0">
              {profileData.bio}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span className="text-sm">Joined {profileData.joinDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flag size={16} />
                <span className="text-sm">
                  {profileData.problemsReported} Reports
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4 md:mt-0 md:self-start md:ml-auto">
            <button
              onClick={() => setIsEditing(true)}
              className="p-3 rounded-full bg-white border border-gray-200 shadow-sm text-gray-500 hover:scale-110 hover:text-purple-600 transition-all w-12 h-12 flex items-center justify-center"
              title="Edit Profile"
            >
              <Edit size={22} />
            </button>
            <button
              onClick={() => setCurrentView("delete")}
              className="p-3 rounded-full bg-red-50 border border-red-200 shadow-sm text-red-500 hover:scale-110 hover:bg-red-100 transition-all w-12 h-12 flex items-center justify-center"
              title="Delete Profile"
            >
              <Trash2 size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            window.innerWidth < 640
              ? "repeat(2, 1fr)"
              : "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            label: "Problems Reported",
            value: profileData.problemsReported,
            icon: <Flag size={24} />,
            color: theme.primary,
          },
          {
            label: "Problems Resolved",
            value: profileData.problemsResolved,
            icon: <CheckCircle size={24} />,
            color: colors.status.resolved,
          },
          {
            label: "Upvotes Received",
            value: profileData.upvotesReceived,
            icon: <ThumbsUp size={24} />,
            color: colors.accent.pink,
          },
          {
            label: "Comments Received",
            value: profileData.commentsReceived,
            icon: <MessageCircle size={24} />,
            color: colors.primary[500],
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: colors.gray[50],
              borderRadius: "16px",
              padding: "1.5rem",
              textAlign: "center",
              transition: "transform 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: stat.color + "20",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                color: stat.color,
              }}
            >
              {stat.icon}
            </div>
            <div
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: "800",
                color: colors.text.primary,
                marginBottom: "0.25rem",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
                color: colors.text.secondary,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth < 1024 ? "1fr" : "2fr 1fr",
          gap: "2rem",
        }}
      >
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Contact Information */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              border: `1px solid ${colors.border.light}`,
              flex: 1,
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "800",
                color: colors.text.primary,
                marginBottom: "1.5rem",
              }}
            >
              Contact Information
            </h3>

            {[
              {
                icon: <Mail size={20} />,
                label: "Email",
                value: profileData.email,
              },
              {
                icon: <Phone size={20} />,
                label: "Phone",
                value: profileData.phone,
              },
              {
                icon: <MapPin size={20} />,
                label: "Address",
                value: [
                  profileData.addressLine,
                  profileData.city,
                  profileData.state,
                  profileData.pincode,
                ]
                  .filter(Boolean)
                  .join(", "),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "1rem",
                  padding: "1rem",
                  borderRadius: "12px",
                  backgroundColor: colors.gray[50],
                  marginBottom: "0.75rem",
                }}
              >
                <div style={{ color: theme.primary }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: colors.text.secondary,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      color: colors.text.primary,
                      fontWeight: "600",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Recent Activity */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              border: `1px solid ${colors.border.light}`,
              flex: 1,
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "800",
                color: colors.text.primary,
                marginBottom: "1.5rem",
              }}
            >
              Recent Reports
            </h3>

            {profileData.recentPosts.map((post, idx) => {
              const statusColors = {
                resolved: colors.status.resolved,
                "in-progress": colors.status.inProgress,
                pending: colors.status.pending,
              };

              return (
                <div
                  key={idx}
                  style={{
                    padding: "1rem",
                    borderRadius: "12px",
                    backgroundColor: colors.gray[50],
                    marginBottom: "0.75rem",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.light;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.gray[50];
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      color: colors.text.primary,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {post.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "6px",
                        backgroundColor: statusColors[post.status] + "20",
                        color: statusColors[post.status],
                        fontWeight: "700",
                        textTransform: "capitalize",
                      }}
                    >
                      {post.status.replace("-", " ")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: colors.text.secondary,
                      }}
                    >
                      {post.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "1.5rem",
          marginTop: "2rem",
          border: `1px solid ${colors.border.light}`,
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "800",
            color: colors.text.primary,
            marginBottom: "1.5rem",
          }}
        >
          Problems Reported by Category
        </h3>

        {profileData.categories.map((cat, idx) => (
          <div key={idx} style={{ marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: colors.text.primary,
                }}
              >
                {cat.name}
              </span>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "800",
                  color: theme.primary,
                }}
              >
                {cat.count}
              </span>
            </div>
            <div
              style={{
                height: "8px",
                borderRadius: "9999px",
                backgroundColor: colors.gray[200],
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(cat.count / profileData.problemsReported) * 100}%`,
                  background: theme.gradient,
                  borderRadius: "9999px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // EDIT VIEW
  const renderEditView = () => (
    <div
      style={{
        padding: "clamp(1rem, 3vw, 2rem)",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: "800",
            color: colors.text.primary,
          }}
        >
          Edit Profile
        </h1>

        <button
          onClick={() => setIsEditing(false)}
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: colors.gray[100],
            cursor: "pointer",
          }}
        >
          <X size={24} />
        </button>
      </div>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "clamp(1rem, 3vw, 2rem)",
          border: `1px solid ${colors.border.light}`,
        }}
      >
        {/* Profile Picture */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "inline-block",
              width: "clamp(100px, 15vw, 120px)",
              height: "clamp(100px, 15vw, 120px)",
              borderRadius: "50%",
              background: profileImage
                ? `url(${profileImage})`
                : theme.gradient,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            {!profileImage && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: "800",
                  color: "white",
                  borderRadius: "50%",
                }}
              >
                {editForm.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Form Fields */}
        {[
          { label: "Full Name", field: "name", type: "text" },
          { label: "Email", field: "email", type: "email" },
          { label: "Phone", field: "phone", type: "tel" },
        ].map((input, idx) => (
          <div key={idx} style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: colors.text.primary,
                marginBottom: "0.5rem",
              }}
            >
              {input.label}
            </label>
            <input
              type={input.type}
              value={editForm[input.field]}
              onChange={(e) => handleEditChange(input.field, e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.border.light}`,
                fontSize: "1rem",
              }}
            />
          </div>
        ))}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ gridColumn: "1 / -1" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: colors.text.primary,
                marginBottom: "0.5rem",
              }}
            >
              Address Line
            </label>
            <input
              type="text"
              value={editForm.addressLine || ""}
              onChange={(e) => handleEditChange("addressLine", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.border.light}`,
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: colors.text.primary,
                marginBottom: "0.5rem",
              }}
            >
              City
            </label>
            <input
              type="text"
              value={editForm.city || ""}
              onChange={(e) => handleEditChange("city", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.border.light}`,
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: colors.text.primary,
                marginBottom: "0.5rem",
              }}
            >
              State
            </label>
            <input
              type="text"
              value={editForm.state || ""}
              onChange={(e) => handleEditChange("state", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.border.light}`,
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: colors.text.primary,
                marginBottom: "0.5rem",
              }}
            >
              Country
            </label>
            <input
              type="text"
              value={editForm.country || ""}
              onChange={(e) => handleEditChange("country", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.border.light}`,
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: colors.text.primary,
                marginBottom: "0.5rem",
              }}
            >
              Pincode
            </label>
            <input
              type="text"
              value={editForm.pincode || ""}
              onChange={(e) => handleEditChange("pincode", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.border.light}`,
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: colors.text.primary,
              marginBottom: "0.5rem",
            }}
          >
            Bio
          </label>
          <textarea
            value={editForm.bio}
            onChange={(e) => handleEditChange("bio", e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: `1px solid ${colors.border.light}`,
              fontSize: "1rem",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleSaveEdit}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              background: theme.gradient,
              color: "white",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <Save size={20} />
            Save Changes
          </button>

          <button
            onClick={() => setIsEditing(false)}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "1rem",
              borderRadius: "12px",
              border: `2px solid ${colors.border.light}`,
              backgroundColor: "white",
              color: colors.text.primary,
              fontSize: "1rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.gray[50];
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "white";
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // DELETE CONFIRMATION VIEW
  const renderDeleteView = () => (
    <div
      style={{
        padding: "clamp(1rem, 3vw, 2rem)",
        maxWidth: "600px",
        margin: "0 auto",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "24px",
          padding: "clamp(2rem, 4vw, 3rem)",
          border: `1px solid ${colors.border.light}`,
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            width: "clamp(60px, 10vw, 80px)",
            height: "clamp(60px, 10vw, 80px)",
            borderRadius: "50%",
            backgroundColor: colors.error + "20",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <Trash2
            size={window.innerWidth < 768 ? 32 : 40}
            color={colors.error}
          />
        </div>

        <h2
          style={{
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            fontWeight: "800",
            color: colors.text.primary,
            marginBottom: "1rem",
          }}
        >
          Delete Your Profile?
        </h2>

        <p
          style={{
            fontSize: "clamp(0.9rem, 2vw, 1rem)",
            color: colors.text.secondary,
            lineHeight: "1.6",
            marginBottom: "2rem",
          }}
        >
          Are you sure you want to delete your citizen profile? This action
          cannot be undone. All your data and reports will be permanently
          removed.
        </p>

        <div
          style={{
            backgroundColor: colors.warning + "10",
            borderLeft: `4px solid ${colors.warning}`,
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontSize: "0.9rem",
              color: colors.text.primary,
              lineHeight: "1.5",
            }}
          >
            <strong>You will lose:</strong>
          </p>
          <ul
            style={{
              fontSize: "0.85rem",
              color: colors.text.secondary,
              marginTop: "0.5rem",
              paddingLeft: "1.5rem",
            }}
          >
            <li>All {profileData.problemsReported} problem reports</li>
            <li>
              {profileData.upvotesReceived} upvotes and{" "}
              {profileData.commentsReceived} comments
            </li>
            <li>All badges and achievements</li>
            <li>Your account history</li>
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleDelete}
            style={{
              flex: 1,
              minWidth: "150px",
              padding: "1rem",
              borderRadius: "12px",
              border: "none",
              backgroundColor: colors.error,
              color: "white",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#dc2626";
              e.target.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = colors.error;
              e.target.style.transform = "scale(1)";
            }}
          >
            Yes, Delete Forever
          </button>

          <button
            onClick={() => setCurrentView("profile")}
            style={{
              flex: 1,
              minWidth: "150px",
              padding: "1rem",
              borderRadius: "12px",
              border: `2px solid ${colors.border.light}`,
              backgroundColor: "white",
              color: colors.text.primary,
              fontSize: "1rem",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.gray[50];
              e.target.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.transform = "scale(1)";
            }}
          >
            Cancel, Keep Profile
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout fullWidth showRightSidebar={false}>
      <div
        style={{
          height: "100%",
          backgroundColor: colors.background.primary,
        }}
      >
        {currentView === "profile" && !isEditing && renderProfileView()}
        {isEditing && renderEditView()}
        {currentView === "delete" && renderDeleteView()}
      </div>
    </ResponsiveLayout>
  );
};

export default CitizenProfile;
