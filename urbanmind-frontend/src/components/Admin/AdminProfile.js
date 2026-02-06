import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  Edit,
  Trash2,
  Save,
  X,
  Users,
  Bell,
  Activity,
} from "lucide-react";
import ResponsiveLayout from "../Common/ResponsiveLayout";

import { colors } from "../../styles/colors";
import { useAuth } from "../../context/AuthContext";
import { getThemeForRole } from "../../styles/theme";
import profileService from "../../services/profileService";
import { getPlatformHealth } from "../../utils/adminUtils";
import AlertModal from "../Common/AlertModal";

const AdminProfileView = () => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showAlert = (title, message, type = "info") => {
    setAlertState({ isOpen: true, title, message, type });
  };

  const [currentView, setCurrentView] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const theme = getThemeForRole(user?.role);
  const [profileData, setProfileData] = useState({
    // From users table
    username: "",
    fullName: "",
    email: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    profilePhotoUrl: null,
    status: "ACTIVE",

    // Admin specific info
    role: "ADMIN",
    joinDate: "",
    lastLogin: "",

    // Admin Stats (Defaults, likely require separate API calls)
    totalVerifications: 0,
    pendingVerifications: 0,
    totalUsers: 0,
    activeAlerts: 0,
    platformHealth: 100,

    permissions: [],
    recentActions: [],
    achievements: [],
  });

  const [editForm, setEditForm] = useState({ ...profileData });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.role && user?.id) {
        try {
          const response = await profileService.getProfile(user.role, user.id);

          // robustly handle response structure (whether {user, profile} wrapper or flat)
          const backendUser = response.user || response;
          const backendProfile = response.profile || {};

          const mappedData = {
            ...backendProfile,
            // User Details
            username: backendUser.username || "",
            fullName: backendUser.fullName || "System Administrator",
            email: backendUser.email || "",
            phone: backendUser.phone || "",
            addressLine: backendUser.addressLine || "",
            city: backendUser.city || "",
            state: backendUser.state || "",
            country: backendUser.country || "",
            pincode: backendUser.pincode || "",

            role: backendUser.primaryRole || "ADMIN",
            joinDate: backendUser.createdAt
              ? new Date(backendUser.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "N/A",
            lastLogin: backendUser.lastLoginAt
              ? new Date(backendUser.lastLoginAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "First Login",

            // Default admin permissions (hardcoded for now as they are static)
            permissions: [
              { name: "User Management", enabled: true, icon: "👥" },
              { name: "System Settings", enabled: true, icon: "⚙️" },
            ],

            // Defaults
            recentActions: [],
            achievements: [],
            platformHealth: getPlatformHealth(),
          };

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
          console.error("Failed to fetch profile", error.message);
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
      };
      await profileService.updateProfile(user.role, user.id, dataToSend);

      setProfileData({ ...editForm, fullName: dataToSend.fullName });
      setIsEditing(false);
      setCurrentView("profile");
      showAlert("Success", "Profile updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update profile", error);
      showAlert("Error", "Failed to update profile", "error");
    }
  };

  const handleDelete = () => {
    showAlert(
      "Action Denied",
      "Admin Profile cannot be deleted. Please contact system owner.",
      "warning",
    );
    setCurrentView("profile");
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
              Administrator Profile
            </h1>
            <p className="text-white/95 text-sm md:text-base">
              System administrator and platform overseer
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
              {!profileImage && profileData.fullName.charAt(0)}
            </div>
            <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-1.5 border-[3px] border-white flex items-center justify-center">
              <Shield
                size={window.innerWidth < 768 ? 16 : 20}
                className="w-4 h-4 md:w-5 md:h-5 text-white"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left mt-2 md:mt-0 w-full">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 mb-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 drop-shadow-sm">
                {profileData.fullName}
              </h2>
              <span className="px-3 py-1 rounded-lg text-sm font-bold bg-blue-50 text-blue-600 flex items-center gap-1">
                <Shield size={14} />
                Super Admin
              </span>
            </div>

            <p className="text-gray-500 text-sm md:text-base mb-3">
              {profileData.email}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span className="text-sm">
                  Admin since {profileData.joinDate}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={16} />{" "}
                {/* Changed from Clock to Activity as per original code's icon usage */}
                <span className="text-sm">
                  Last login: {profileData.lastLogin}
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
              onClick={() => handleDelete()}
              className="p-3 rounded-full bg-red-50 border border-red-200 shadow-sm text-red-500 hover:scale-110 hover:bg-red-100 transition-all w-12 h-12 flex items-center justify-center"
              title="Delete Profile"
            >
              <Trash2 size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 mb-8 px-4 md:px-0">
        {[
          {
            label: "Total Verifications",
            value: profileData.totalVerifications,
            icon: <CheckCircle size={24} />,
            color: colors.success,
          },
          {
            label: "Pending Reviews",
            value: profileData.pendingVerifications,
            icon: <Users size={24} />,
            color: colors.warning,
          },
          {
            label: "Active Alerts",
            value: profileData.activeAlerts,
            icon: <Bell size={24} />,
            color: colors.error,
          },
          {
            label: "Platform Health",
            value: `${profileData.platformHealth}%`,
            icon: <Activity size={24} />,
            color: theme.primary,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-2xl p-6 text-center transition-transform duration-200 cursor-pointer hover:-translate-y-1"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: stat.color + "20", color: stat.color }}
            >
              {stat.icon}
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-1">
              {stat.value}
            </div>
            <div className="text-sm md:text-base text-gray-500">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="w-full px-4 md:px-0">
        {/* Full Width Column */}
        <div>
          {/* Personal Details */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "2rem",
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
              Personal Information
            </h3>

            {[
              {
                icon: <User size={20} />,
                label: "Full Name",
                value: profileData.fullName,
              },
              {
                icon: <Mail size={20} />,
                label: "Email Address",
                value: profileData.email,
              },
              {
                icon: <Phone size={20} />,
                label: "Phone Number",
                value: profileData.phone,
              },
              {
                icon: <MapPin size={20} />,
                label: "Address",
                value: `${profileData.addressLine}, ${profileData.city}, ${profileData.state} - ${profileData.pincode}`,
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
                      wordBreak: "break-word",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Admin Permissions */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "1.5rem",
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
              Admin Permissions
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  window.innerWidth < 640 ? "1fr" : "repeat(2, 1fr)",
                gap: "1rem",
              }}
            >
              {profileData.permissions.map((perm, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1rem",
                    borderRadius: "12px",
                    backgroundColor: colors.gray[50],
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ fontSize: "1.5rem" }}>{perm.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        color: colors.text.primary,
                        marginBottom: "0.25rem",
                      }}
                    >
                      {perm.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "6px",
                        backgroundColor: colors.success + "20",
                        color: colors.success,
                        fontWeight: "700",
                        display: "inline-block",
                      }}
                    >
                      Enabled
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        {/* Right Column - REMOVED */}
        <div></div>
      </div>
      <AlertModal
        isOpen={alertState.isOpen}
        onClose={() => setAlertState({ ...alertState, isOpen: false })}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
      />
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
          Edit Admin Profile
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
                {editForm.fullName.charAt(0)}
              </div>
            )}
          </div>
        </div>
        {/* Form Fields - Organization Details */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: colors.text.primary,
              marginBottom: "0.5rem",
            }}
          >
            Full Name
          </label>
          <input
            type="text"
            value={editForm.fullName}
            onChange={(e) => handleEditChange("fullName", e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: `1px solid ${colors.border.light}`,
              fontSize: "1rem",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth < 640 ? "1fr" : "1fr 1fr",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
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
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => handleEditChange("email", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.border.light}`,
                fontSize: "1rem",
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
              Phone
            </label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => handleEditChange("phone", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.border.light}`,
                fontSize: "1rem",
              }}
            />
          </div>
        </div>

        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: "700",
            color: colors.text.primary,
            marginTop: "2rem",
            marginBottom: "1rem",
          }}
        >
          Address Information
        </h3>

        <div style={{ marginBottom: "1.5rem" }}>
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
            value={editForm.addressLine}
            onChange={(e) => handleEditChange("addressLine", e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: `1px solid ${colors.border.light}`,
              fontSize: "1rem",
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth < 640 ? "1fr" : "1fr 1fr",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
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
              value={editForm.city}
              onChange={(e) => handleEditChange("city", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.border.light}`,
                fontSize: "1rem",
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
              value={editForm.state}
              onChange={(e) => handleEditChange("state", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.border.light}`,
                fontSize: "1rem",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth < 640 ? "1fr" : "1fr 1fr",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
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
              value={editForm.country}
              onChange={(e) => handleEditChange("country", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.border.light}`,
                fontSize: "1rem",
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
              value={editForm.pincode}
              onChange={(e) => handleEditChange("pincode", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: `1px solid ${colors.border.light}`,
                fontSize: "1rem",
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: window.innerWidth < 640 ? "column" : "row",
          }}
        >
          <button
            onClick={handleSaveEdit}
            style={{
              flex: 1,
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
          padding: "3rem",
          border: `1px solid ${colors.border.light}`,
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: colors.error + "20",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <Trash2 size={40} color={colors.error} />
        </div>

        <h2
          style={{
            fontSize: "1.75rem",
            fontWeight: "800",
            color: colors.text.primary,
            marginBottom: "1rem",
          }}
        >
          Delete NGO Profile?
        </h2>

        <p
          style={{
            fontSize: "1rem",
            color: colors.text.secondary,
            lineHeight: "1.6",
            marginBottom: "2rem",
          }}
        >
          Are you sure you want to delete your NGO profile? This action cannot
          be undone. All your organization data, projects, and records will be
          permanently removed.
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
            <li>{profileData.activeProjects} active projects</li>
            <li>{profileData.problemsSolvedCount} solved problems history</li>
            <li>
              All team member connections ({profileData.teamMembers} members)
            </li>
            <li>Verification status and achievements</li>
            <li>
              All donation records (₹
              {(profileData.totalDonationsReceived / 100000).toFixed(1)}L)
            </li>
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: window.innerWidth < 640 ? "column" : "row",
          }}
        >
          <button
            onClick={handleDelete}
            style={{
              flex: 1,
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
        {/* Alert Modal */}
        <AlertModal
          isOpen={alertState.isOpen}
          onClose={() => setAlertState({ ...alertState, isOpen: false })}
          title={alertState.title}
          message={alertState.message}
          type={alertState.type}
        />
      </div>
    </ResponsiveLayout>
  );
};

export default AdminProfileView;
