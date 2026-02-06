// src/styles/globalStyles.js
// Global CSS-in-JS utility classes for UrbanMind

import { colors, shadows } from './colors';

export const globalStyles = {
  // Container Styles
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
  },

  containerFluid: {
    width: '100%',
    padding: '0 1rem',
  },

  // Card Styles
  card: {
    backgroundColor: colors.background.card,
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: shadows.card,
    border: `1px solid ${colors.border.light}`,
  },

  cardHover: {
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: shadows.hover,
      transform: 'translateY(-2px)',
    },
  },

  // Button Styles
  button: {
    base: {
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      outline: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    primary: {
      backgroundColor: colors.primary[500],
      color: colors.text.inverse,
      '&:hover': {
        backgroundColor: colors.primary[600],
        boxShadow: shadows.md,
      },
    },
    secondary: {
      backgroundColor: colors.secondary[500],
      color: colors.text.inverse,
      '&:hover': {
        backgroundColor: colors.secondary[600],
      },
    },
    outline: {
      backgroundColor: 'transparent',
      border: `2px solid ${colors.primary[500]}`,
      color: colors.primary[500],
      '&:hover': {
        backgroundColor: colors.primary[50],
      },
    },
    danger: {
      backgroundColor: colors.error,
      color: colors.text.inverse,
      '&:hover': {
        backgroundColor: '#dc2626',
      },
    },
  },

  // Input Styles
  input: {
    base: {
      width: '100%',
      padding: '0.75rem 1rem',
      borderRadius: '8px',
      border: `2px solid ${colors.border.default}`,
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      '&:focus': {
        borderColor: colors.primary[500],
        boxShadow: `0 0 0 3px ${colors.primary[100]}`,
      },
    },
    error: {
      borderColor: colors.error,
      '&:focus': {
        borderColor: colors.error,
        boxShadow: `0 0 0 3px rgba(239, 68, 68, 0.1)`,
      },
    },
  },

  // Badge Styles
  badge: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '600',
    },
    citizen: {
      backgroundColor: colors.roles.citizen,
      color: colors.text.inverse,
    },
    volunteer: {
      backgroundColor: colors.roles.volunteer,
      color: colors.text.inverse,
    },
    ngo: {
      backgroundColor: colors.roles.ngo,
      color: colors.text.inverse,
    },
    admin: {
      backgroundColor: colors.roles.admin,
      color: colors.text.inverse,
    },
    pending: {
      backgroundColor: colors.status.pending,
      color: colors.text.primary,
    },
    resolved: {
      backgroundColor: colors.status.resolved,
      color: colors.text.inverse,
    },
  },

  // Layout Styles
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },

  grid2Cols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
  },

  grid3Cols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
  },

  // Typography Styles
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: '700',
      lineHeight: '1.2',
      color: colors.text.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: '600',
      lineHeight: '1.3',
      color: colors.text.primary,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.4',
      color: colors.text.primary,
    },
    body: {
      fontSize: '1rem',
      lineHeight: '1.6',
      color: colors.text.primary,
    },
    small: {
      fontSize: '0.875rem',
      lineHeight: '1.5',
      color: colors.text.secondary,
    },
  },

  // Utility Classes
  utilities: {
    truncate: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    fadeIn: {
      animation: 'fadeIn 0.3s ease-in',
    },
    slideUp: {
      animation: 'slideUp 0.4s ease-out',
    },
  },
};

// Animation Keyframes (for CSS-in-JS)
export const animations = `
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

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default globalStyles;