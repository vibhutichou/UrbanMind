// src/components/Common/Sidebar.js
// Twitter-style sidebar with role-based themes and dark mode support

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext"; // ✅ ADD THIS
import { getThemeForRole } from "../../styles/theme";
import {
  Home,
  Camera,
  Bell,
  User,
  Settings,
  Heart,
  TrendingUp,
  Users,
  Shield,
  FileText,
  Award,
  LogOut,
  Menu, // Added Menu import
} from "lucide-react";
import { colors, shadows } from "../../styles/colors";
import { useNotifications } from "../../context/NotificationContext";

import Logo from "./Logo"; // Imported Logo

const Sidebar = ({ isEmbedded = false, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const theme = getThemeForRole(user?.role?.toLowerCase());
  const [internalIsOpen, setInternalIsOpen] = useState(false); // Mobile menu state
  const isOpen = isEmbedded ? true : internalIsOpen;

  const { theme: appTheme } = useTheme(); // ✅ Dark/Light mode
  const isDark = appTheme === "dark";

  // ✅ Dynamic colors based on theme
  const bgPrimary = isDark ? "#0f172a" : colors.background.primary;
  const bgSecondary = isDark ? "#1e293b" : "white";
  const bgHover = isDark ? "#334155" : colors.gray[100];
  const textPrimary = isDark ? "#f8fafc" : colors.text.primary;
  const textSecondary = isDark ? "#cbd5e1" : colors.text.secondary;
  const borderColor = isDark ? "#475569" : colors.border.light;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => setInternalIsOpen(!internalIsOpen);
  const closeMenu = () => {
    setInternalIsOpen(false);
    if (onNavigate) onNavigate();
  };

  // Different menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      {
        icon: <Home size={26} />,
        label: "Home",
        path: `/${user?.role}/dashboard`,
      },
      {
        icon: <Bell size={26} />,
        label: "Notifications",
        path: `/${user?.role}/notifications`,
        badge: unreadCount > 0 ? unreadCount : null,
      },
      {
        icon: <User size={26} />,
        label: "Profile",
        path: `/${user?.role}/profile`,
      },
      {
        icon: <Settings size={26} />,
        label: "Settings",
        path: `/${user?.role}/settings`,
      },
    ];

    // Role-specific items
    if (user?.role === "citizen") {
      baseItems.splice(
        1,
        0,
        {
          icon: <Camera size={26} />,
          label: "Reported Problem",
          path: "/citizen/reported-problems",
        },
        {
          icon: <Heart size={26} />,
          label: "My Donations",
          path: "/citizen/donations",
        },
      );
    } else if (user?.role === "volunteer") {
      baseItems.splice(
        1,
        0,
        {
          icon: <TrendingUp size={26} />,
          label: "My Solutions",
          path: "/volunteer/solutions",
        },
        {
          icon: <Award size={26} />,
          label: "Leaderboard",
          path: "/volunteer/leaderboard",
        },
        {
          icon: <FileText size={26} />,
          label: "Verification",
          path: "/volunteer/verification",
        },
      );
    } else if (user?.role === "ngo") {
      baseItems.splice(
        1,
        0,
        {
          icon: <TrendingUp size={26} />,
          label: "Projects",
          path: "/ngo/projects",
        },
        {
          icon: <FileText size={26} />,
          label: "Verification",
          path: "/ngo/verification",
        },
      );
    } else if (user?.role === "admin") {
      baseItems.splice(
        1,
        0,
        {
          icon: <Users size={26} />,
          label: "User Management",
          path: "/admin/users",
        },
        {
          icon: <Shield size={26} />,
          label: "Verifications",
          path: "/admin/verification",
        },
      );
    }

    return baseItems;
  };

  const menuItems = getMenuItems();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Hamburger Button - Only visible on mobile */}
      {!isEmbedded && (
        <button
          className="md:hidden flex items-center gap-2 p-4 mb-4 transition-transform hover:scale-105"
          onClick={toggleMenu}
        >
          <span className="text-3xl">
            <Logo size={40} />
          </span>
          <span
            className="text-3xl font-extrabold text-transparent bg-clip-text"
            style={{
              backgroundImage: theme.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            UrbanMind
          </span>
        </button>
      )}

      {/* Overlay for mobile */}
      {!isEmbedded && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
        />
      )}

      <div
        className={`flex flex-col p-4 z-50 transition-transform duration-300 ease-in-out bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800
          ${
            isEmbedded
              ? "relative w-full h-full translate-x-0 border-none" // Desktop: Relative flow, full width/height
              : `fixed top-0 left-0 h-screen w-[275px] ${isOpen ? "translate-x-0" : "-translate-x-full"}` // Mobile: Fixed overlay
          }
        `}
      >
        {/* Logo */}
        <div
          onClick={() => {
            navigate(`/${user?.role}/dashboard`);
            closeMenu();
          }}
          className="text-2xl font-extrabold cursor-pointer p-4 mb-4 transition-transform hover:scale-105 flex items-center gap-2"
        >
          <Logo size={50} />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: theme.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            UrbanMind
          </span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                navigate(item.path);
                closeMenu();
              }}
              className={`w-full flex items-center gap-5 px-6 py-4 rounded-full text-[1.1rem] font-medium transition-all text-left duration-200
                ${
                  isActive(item.path)
                    ? "font-bold"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:translate-x-1"
                }
              `}
              style={
                isActive(item.path)
                  ? {
                      backgroundColor: theme.light,
                      color: theme.primary,
                    }
                  : {}
              }
            >
              <div className="relative">
                {/* Clone element to force color update if needed, but style usually cascades */}
                {React.cloneElement(item.icon, {
                  color: isActive(item.path) ? theme.primary : undefined,
                })}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[0.6rem] font-bold flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Action Button - Desktop Only */}
        {user?.role === "citizen" && (
          <button
            onClick={() => {
              navigate("/citizen/report-problem");
              closeMenu();
            }}
            className="w-full p-4 mb-4 border-none rounded-full text-white text-lg font-bold cursor-pointer transition-transform hover:scale-102 shadow-md hover:shadow-lg"
            style={{ background: theme.gradient }}
          >
            Report Problem
          </button>
        )}

        {/* User Profile Card */}
        <div className="p-3 rounded-full flex items-center gap-3 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0"
            style={{ background: theme.gradient }}
          >
            {(
              user?.fullName ||
              user?.name ||
              user?.username ||
              user?.email ||
              "U"
            )
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
              {user?.fullName || user?.name || user?.username || user?.email}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              @
              {(user?.username || user?.email?.split("@")[0] || "user")
                .toLowerCase()
                .replace(/\s+/g, "")}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-all hover:rotate-180"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
