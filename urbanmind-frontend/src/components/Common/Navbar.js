// src/components/Common/Navbar.js
// Navigation bar for logged-in users

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { colors, shadows, gradients } from '../../styles/colors';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadgeColor = (role) => {
    return colors.roles[role] || colors.primary[500];
  };

  return (
    <nav style={{
      backgroundColor: colors.background.primary,
      boxShadow: shadows.md,
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate(`/${user?.role}/dashboard`)}
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: gradients.hero,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          🏙️ UrbanMind
        </div>

        {/* Desktop Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {/* Notifications */}
          <button
            style={{
              position: 'relative',
              padding: '0.5rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = colors.gray[100]}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <Bell size={22} color={colors.text.secondary} />
            {/* Notification Badge */}
            <span style={{
              position: 'absolute',
              top: '0.25rem',
              right: '0.25rem',
              width: '8px',
              height: '8px',
              backgroundColor: colors.error,
              borderRadius: '50%'
            }} />
          </button>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: `1px solid ${colors.border.light}`,
                backgroundColor: colors.background.primary,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = colors.primary[500]}
              onMouseLeave={(e) => e.target.style.borderColor = colors.border.light}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: gradients.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1rem'
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: colors.text.primary
                }}>
                  {user?.name}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'white',
                  backgroundColor: getRoleBadgeColor(user?.role),
                  padding: '0.125rem 0.5rem',
                  borderRadius: '12px',
                  textTransform: 'capitalize'
                }}>
                  {user?.role}
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                width: '220px',
                backgroundColor: colors.background.primary,
                borderRadius: '12px',
                boxShadow: shadows.xl,
                border: `1px solid ${colors.border.light}`,
                overflow: 'hidden',
                zIndex: 200
              }}>
                <div style={{
                  padding: '1rem',
                  borderBottom: `1px solid ${colors.border.light}`
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: colors.text.primary,
                    marginBottom: '0.25rem'
                  }}>
                    {user?.name}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: colors.text.secondary
                  }}>
                    {user?.email?.charAt(0).toUpperCase()}
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate(`/${user?.role}/profile`);
                    setShowUserMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.9rem',
                    color: colors.text.primary,
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = colors.gray[50]}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <User size={18} />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    navigate(`/${user?.role}/settings`);
                    setShowUserMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontSize: '0.9rem',
                    color: colors.text.primary,
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = colors.gray[50]}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <Settings size={18} />
                  Settings
                </button>

                <div style={{
                  borderTop: `1px solid ${colors.border.light}`,
                  padding: '0.5rem'
                }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '0.9rem',
                      color: colors.error,
                      fontWeight: '600',
                      borderRadius: '6px',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#fee2e2'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div
          onClick={() => setShowUserMenu(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 150
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;