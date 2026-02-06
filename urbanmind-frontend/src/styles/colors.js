// src/styles/colors.js
// UrbanMind Color System - Modern & Accessible

export const colors = {
  // Primary Brand Colors
  primary: {
    50: "#e6f2ff",
    100: "#b3d9ff",
    200: "#80c0ff",
    300: "#4da6ff",
    400: "#1a8dff",
    500: "#0073e6", // Main brand color
    600: "#005bb3",
    700: "#004380",
    800: "#002b4d",
    900: "#00131a",
  },

  // Secondary Colors (For Volunteers/NGOs)
  secondary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // Success/Action color
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Accent Colors
  accent: {
    orange: "#ff6b35", // For urgency/high priority
    purple: "#8b5cf6", // For NGOs
    yellow: "#fbbf24", // For warnings
    pink: "#ec4899", // For donations
  },

  // Semantic Colors
  success: "#22c55e",
  warning: "#fbbf24",
  error: "#ef4444",
  info: "#3b82f6",

  // Neutral Grays
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },

  // Background Colors
  background: {
    primary: "var(--bg-primary)",
    secondary: "var(--bg-secondary)",
    dark: "#111827",
    card: "var(--bg-primary)",
  },

  // Text Colors
  text: {
    primary: "var(--text-primary)",
    secondary: "var(--text-secondary)",
    disabled: "#9ca3af",
    inverse: "#ffffff",
  },

  // Role-specific Colors
  roles: {
    citizen: "#0073e6",
    volunteer: "#b3174b", // Crimson red
    ngo: "#7c3aed", // Purple/Violet
    admin: "#6b7280", // Grey
  },

  // Status Colors
  status: {
    pending: "#fbbf24",
    inProgress: "#3b82f6",
    resolved: "#22c55e",
    rejected: "#ef4444",
    verified: "#22c55e",
    unverified: "#9ca3af",
  },

  // Border Colors
  border: {
    light: "var(--border-light)",
    default: "#d1d5db",
    dark: "#9ca3af",
  },
};

// Gradient Definitions
export const gradients = {
  primary: "linear-gradient(135deg, #0073e6 0%, #005bb3 100%)",
  secondary: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  hero: "linear-gradient(135deg, #0073e6 0%, #8b5cf6 100%)",
  card: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
};

// Shadow Definitions
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  card: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  hover: "0 10px 20px -5px rgba(0, 115, 230, 0.3)",
};

export default { colors, gradients, shadows };
