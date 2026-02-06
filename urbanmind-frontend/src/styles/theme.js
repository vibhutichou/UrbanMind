// src/styles/theme.js
// Dynamic themes based on user role

import { colors } from './colors';

export const getThemeForRole = (role) => {
  const themes = {
    citizen: {
      primary: colors.roles.citizen,
      gradient: 'linear-gradient(135deg, #0073e6 0%, #005bb3 100%)',
      light: '#e6f2ff',
      hover: '#b3d9ff',
      shadow: 'rgba(0, 115, 230, 0.3)'
    },
    volunteer: {
      primary: 'rgb(179, 23, 75)',
      gradient: 'linear-gradient(135deg, rgb(179, 23, 75) 0%, rgb(140, 18, 59) 100%)',
      light: '#fce7f3',
      hover: '#fbcfe8',
      shadow: 'rgba(179, 23, 75, 0.3)'
    },
    ngo: {
      primary: '#7c3aed',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      light: '#f3e8ff',
      hover: '#e9d5ff',
      shadow: 'rgba(124, 58, 237, 0.3)'
    },
    admin: {
      primary: '#6b7280',
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      light: '#f3f4f6',
      hover: '#e5e7eb',
      shadow: 'rgba(107, 114, 128, 0.3)'
    }
  };

  return themes[role] || themes.citizen;
};

export default { getThemeForRole }; export const lightColors = {
  background: '#ffffff',
  text: '#0f172a',
  card: '#f8fafc'
};

export const darkColors = {
  background: '#0f172a',
  text: '#f8fafc',
  card: '#1e293b'
};
