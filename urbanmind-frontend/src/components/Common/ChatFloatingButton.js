// src/components/Common/ChatFloatingButton.js
// Global Floating Chat Button (role-colored, same size as + FAB)

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/colors';

const ChatFloatingButton = ({ hidden }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Hide chat button when FAB menu is open
  if (hidden) return null;

  // SAME role-based color logic as FloatingActionButton
  const getRoleColor = () => {
    return colors.roles[user?.role] || colors.primary[500];
  };

  const isAdminPage = ['/admin/users', '/admin/verification'].includes(location.pathname);

  return (
    <button
      onClick={() => navigate('/chats')}
      style={{
        position: 'fixed',
        right: isAdminPage ? '7rem' : '2rem',
        bottom: isAdminPage ? '2rem' : '6.8rem',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: getRoleColor(),
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        zIndex: 991,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
      }}
      aria-label="Open Chats"
    >
      <MessageCircle size={30} color="white" strokeWidth={2.6} />
    </button>
  );
};

export default ChatFloatingButton;
