import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import profileService from "../../../services/profileService";
import ResponsiveLayout from "../../Common/ResponsiveLayout";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Building2,
  FileText,
  Globe,
  Users,
  DollarSign,
  Edit,
  Trash2,
  Save,
  X,
  Star,
  Briefcase,
  Shield,
} from "lucide-react";

const colors = {
  text: {
    primary: "#1F2937",
    secondary: "#6B7280",
  },
  background: {
    primary: "#F9FAFB",
  },
  border: {
    light: "#E5E7EB",
  },
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    400: "#9CA3AF",
  },
  status: {
    resolved: "#10B981",
    pending: "#F59E0B",
  },
  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  primary: {
    500: "#8B5CF6",
  },
};

const theme = {
  primary: "#8B5CF6",
  gradient: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
  light: "#F3F0FF",
};

const NGOProfile = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
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

    // From ngo_profile table
    organizationName: "",
    registrationNumber: "",
    registrationAuthority: "",
    panNumber: "",
    contactPersonName: "",
    contactPersonPhone: "",
    contactPersonEmail: "",
    websiteUrl: "",
    verificationStatus: "PENDING",

    // Stats & Additional Info
    totalDonationsReceived: 0,
    problemsSolvedCount: 0,
    ratingAverage: 0,
    ratingCount: 0,
    joinDate: "",
    activeProjects: 0,
    teamMembers: 0,
    volunteers: 0,

    categories: [],
    recentProjects: [],
    achievements: [],
  });

  const [editForm, setEditForm] = useState({ ...profileData });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.role && user?.id) {
        try {
          console.log("Fetching NGO profile for:", user.role, user.id);
          const response = await profileService.getProfile(user.role, user.id);
          console.log("NGO Profile Response:", response);
          const { user: backendUser, profile: backendProfile } = response;

          const mappedData = {
            // User Details
            username: backendUser.username || "",
            fullName: backendUser.fullName || "",
            email: backendUser.email || "",
            phone: backendUser.phone || "",
            addressLine:
              backendUser.addressLine || backendProfile.addressLine || "",
            city: backendUser.city || backendProfile.city || "",
            state: backendUser.state || backendProfile.state || "",
            country: backendUser.country || backendProfile.country || "",
            pincode: backendUser.pincode || backendProfile.pincode || "",

            // NGO Specifics (backendUser.fullName is usually Org Name for NGO role)
            organizationName:
              backendProfile.organizationName ||
              backendUser.fullName ||
              "NGO Organization",
            registrationNumber: backendProfile.registrationNumber || "",
            registrationAuthority: backendProfile.registrationAuthority || "",
            panNumber: backendProfile.panNumber || "",

            // // Contact Person (Assuming fields exist in backend profile, else map safely)
            // // If separate contact person fields don't exist in backend DTO yet, placeholder:
            // contactPersonName: backendProfile.contactPersonName || '',
            // contactPersonPhone: backendProfile.contactPersonPhone || '',
            // contactPersonEmail: backendProfile.contactPersonEmail || '',

            websiteUrl: backendProfile.websiteUrl || "",
            verificationStatus: backendProfile.verificationStatus || "PENDING",
            totalDonationsReceived: backendProfile.totalDonationsReceived || 0,
            ratingAverage: backendProfile.ratingAverage || 0,
            ratingCount: backendProfile.ratingCount || 0,

            // Stats from backend
            problemsSolvedCount: backendProfile.problemsSolvedCount || 0,
            activeProjects: backendProfile.activeProjects || 0,
            teamMembers: backendProfile.teamMembers || 0,

            // Defaults for arrays
            categories: [],
            recentProjects: [],
            achievements: [],
            profilePhotoUrl: backendUser.profilePhotoUrl || null,
          };

          setProfileData((prev) => ({ ...prev, ...mappedData }));
          setEditForm((prev) => ({ ...prev, ...mappedData }));

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
        fullName: editForm.organizationName, // Map back if needed
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
        "Are you sure you want to delete your NGO profile? This action cannot be undone.",
      )
    ) {
      try {
        await profileService.deleteProfile(user.role, user.id);
        alert("NGO Profile deleted successfully!");
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
              NGO Profile
            </h1>
            <p className="text-white/95 text-sm md:text-base">
              Manage your organization information
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
              {!profileImage && profileData.organizationName.charAt(0)}
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
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 mb-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 drop-shadow-sm">
                {profileData.organizationName}
              </h2>
              {profileData.verificationStatus === "VERIFIED" && (
                <span className="px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 bg-green-500/10 text-green-600">
                  <Shield size={14} />
                  Govt Verified
                </span>
              )}
            </div>

            <p className="text-gray-500 text-sm md:text-base mb-2">
              Reg. No: {profileData.registrationNumber}
            </p>

            <p className="text-gray-800 font-medium text-sm md:text-base mb-4">
              {profileData.registrationAuthority}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span className="text-sm">Since {profileData.joinDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} />
                <span className="text-sm">
                  {profileData.ratingAverage} ({profileData.ratingCount}{" "}
                  reviews)
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
            label: "Active Projects",
            value: profileData.activeProjects,
            icon: <Briefcase size={24} />,
            color: theme.primary,
          },
          {
            label: "Problems Solved",
            value: profileData.problemsSolvedCount,
            icon: <CheckCircle size={24} />,
            color: colors.status.resolved,
          },
          {
            label: "Donations Received",
            value: `₹${(profileData.totalDonationsReceived / 100000).toFixed(1)}L`,
            icon: <DollarSign size={24} />,
            color: colors.warning,
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
        <div>
          {/* Organization Details */}
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
              Organization Details
            </h3>

            {[
              {
                icon: <Building2 size={20} />,
                label: "Organization Name",
                value: profileData.organizationName,
              },
              {
                icon: <FileText size={20} />,
                label: "PAN Number",
                value: profileData.panNumber,
              },
              {
                icon: <Mail size={20} />,
                label: "Official Email",
                value: profileData.email,
              },
              {
                icon: <Phone size={20} />,
                label: "Contact Number",
                value: profileData.phone,
              },
              {
                icon: <Globe size={20} />,
                label: "Website",
                value: profileData.websiteUrl,
              },
              {
                icon: <MapPin size={20} />,
                label: "Address",
                value:
                  [profileData.addressLine, profileData.city, profileData.state]
                    .filter(Boolean)
                    .join(", ") +
                  (profileData.pincode ? ` - ${profileData.pincode}` : ""),
              },
            ]
              .filter((item) => {
                // Only show if value exists and is not just an empty string or just the separators
                if (!item.value) return false;
                const strVal = String(item.value).trim();
                return strVal !== "" && strVal !== " - ";
              })
              .map((item, idx) => (
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
        </div>

        {/* Right Column */}
        <div>
          {/* Achievements */}
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
              Achievements
            </h3>

            {profileData.achievements.map((achievement, idx) => (
              <div
                key={idx}
                style={{
                  padding: "1rem",
                  borderRadius: "12px",
                  backgroundColor: colors.gray[50],
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {achievement.icon}
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                    color: colors.text.primary,
                    marginBottom: "0.25rem",
                  }}
                >
                  {achievement.name}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: colors.text.secondary,
                    lineHeight: "1.4",
                  }}
                >
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Projects */}
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
              Recent Projects
            </h3>

            {profileData.recentProjects.map((project, idx) => {
              const statusColors = {
                active: theme.primary,
                completed: colors.status.resolved,
                planning: colors.status.pending,
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
                    {project.title}
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
                        backgroundColor: statusColors[project.status] + "20",
                        color: statusColors[project.status],
                        fontWeight: "700",
                        textTransform: "capitalize",
                      }}
                    >
                      {project.status}
                    </span>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: colors.text.secondary,
                      }}
                    >
                      {project.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Projects by Category */}
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
              Projects by Category
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
                      width: `${(cat.count / profileData.problemsSolvedCount) * 100}%`,
                      background: theme.gradient,
                      borderRadius: "9999px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
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
          Edit NGO Profile
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
                {editForm.organizationName.charAt(0)}
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
            Organization Name
          </label>
          <input
            type="text"
            value={editForm.organizationName}
            onChange={(e) =>
              handleEditChange("organizationName", e.target.value)
            }
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
              Registration Number
            </label>
            <input
              type="text"
              value={editForm.registrationNumber}
              onChange={(e) =>
                handleEditChange("registrationNumber", e.target.value)
              }
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
              PAN Number
            </label>
            <input
              type="text"
              value={editForm.panNumber}
              onChange={(e) => handleEditChange("panNumber", e.target.value)}
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
            Registration Authority
          </label>
          <input
            type="text"
            value={editForm.registrationAuthority}
            onChange={(e) =>
              handleEditChange("registrationAuthority", e.target.value)
            }
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
            Website URL
          </label>
          <input
            type="url"
            value={editForm.websiteUrl}
            onChange={(e) => handleEditChange("websiteUrl", e.target.value)}
            placeholder="https://www.example.org"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: `1px solid ${colors.border.light}`,
              fontSize: "1rem",
            }}
          />
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
      {currentView === "profile" && !isEditing && renderProfileView()}
      {isEditing && renderEditView()}
      {currentView === "delete" && renderDeleteView()}
    </ResponsiveLayout>
  );
};

export default NGOProfile;
