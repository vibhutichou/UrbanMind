// src/components/Common/FloatingActionButton.js
// Floating Action Button with expandable menu
// FULL CODE – label styling + cross alignment fixed

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plus, Camera, Heart, FileText, Users, X, CheckCircle } from 'lucide-react';
import { colors } from '../../styles/colors';

const FloatingActionButton = ({ onToggle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ORIGINAL STATES (UNCHANGED)
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Role-based color
  const getRoleColor = () => {
    return colors.roles[user?.role] || colors.primary[500];
  };

  // Notify parent when FAB opens/closes
  const toggleFab = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (onToggle) onToggle(next);
  };

  // Role-based actions
  const getActions = () => {
    if (user?.role === 'citizen') {
      return [
        { icon: <Camera size={24} />, label: 'Report Problem', path: '/citizen/report-problem', color: colors.roles.citizen },
        { icon: <Heart size={24} />, label: 'Donate', path: '/citizen/donations', color: colors.accent.pink },
      ];
    } else if (user?.role === 'volunteer') {
      return [
        { icon: <Camera size={24} />, label: 'Update Progress', path: '/volunteer/report-problem', color: colors.primary[500] },
      ];
    } else if (user?.role === 'ngo') {
      return [
        { icon: <Users size={24} />, label: 'Add Project', path: '/ngo/projects', color: colors.roles.ngo },
      ];
    } else if (user?.role === 'admin') {
      return [
        {
          icon: <FileText size={24} />,
          label: 'Add Announcement',
          action: () => setShowAnnouncementModal(true),
          color: colors.roles.admin
        },
        { icon: <Users size={24} />, label: 'User Actions', path: '/admin/users', color: colors.primary[500] },
      ];
    }
    return [];
  };

  const handleActionClick = (action) => {
    setIsOpen(false);
    if (onToggle) onToggle(false);

    if (action.action) action.action();
    else if (action.path) navigate(action.path);
  };

  const handleSendAnnouncement = () => {
    if (!announcementMsg.trim()) return;

    // Mock Logic: Send to backend
    console.log("Sending announcement to all users:", announcementMsg);
    // alert("Announcement broadcasted to all users!"); // Removed alert

    setAnnouncementMsg('');
    setShowAnnouncementModal(false);
    setShowSuccessPopup(true);

    // Auto-close success popup after 3 seconds
    setTimeout(() => {
      setShowSuccessPopup(false);
    }, 3000);
  };

  const actions = getActions();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
            if (onToggle) onToggle(false);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 998
          }}
        />
      )}

      {/* Action Buttons */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            right: '2rem',
            bottom: '7rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 999
          }}
        >
          {actions.map((action, index) => (
            <div
              key={index}
              onClick={() => handleActionClick(action)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer'
              }}
            >
              {/* LABEL – WHITE TEXT */}
              <span
                style={{
                  backgroundColor: action.color,
                  padding: '0.55rem 1.1rem',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  whiteSpace: 'nowrap'
                }}
              >
                {action.label}
              </span>

              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: action.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                {action.icon}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2001, // Higher than modal
          pointerEvents: 'none' // Click through background
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            pointerEvents: 'auto',
            border: `1px solid ${colors.success}`
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: colors.success + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.success
            }}>
              <CheckCircle size={32} strokeWidth={3} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: colors.text.primary, marginBottom: '0.25rem' }}>
                Successful!
              </h3>
              <p style={{ fontSize: '0.95rem', color: colors.text.secondary }}>
                Announcement sent to everyone.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={toggleFab}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'fixed',
          right: '2rem',
          bottom: '2rem',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: getRoleColor(),
          border: 'none',
          cursor: 'pointer',
          zIndex: 990,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.3s ease',
          boxShadow: isHovered
            ? '0 12px 32px rgba(0,0,0,0.4)'
            : '0 8px 24px rgba(0,0,0,0.3)'
        }}
      >
        {/* ICON WRAPPER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          <Plus size={32} color="white" strokeWidth={3} />
        </div>
      </button>

      {/* Announcement Modal (Hidden logic but structure implied by state) */}
      {/* We can add the modal UI here if needed, but the original incoming code didn't fully show it in the snippets,
          however, the state `showAnnouncementModal` exists.
          I will assume the Modal functionality might be missing the UI part in the snippet I saw or I should check if I missed it.
          Wait, I'll double check the view_file output.
      */}
      {showAnnouncementModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: colors.text.primary }}>New Announcement</h3>
            <textarea
              value={announcementMsg}
              onChange={(e) => setAnnouncementMsg(e.target.value)}
              placeholder="Type your announcement..."
              style={{
                width: '100%', height: '100px', padding: '0.75rem', borderRadius: '8px',
                border: `1px solid ${colors.border.default}`, marginBottom: '1rem', resize: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: colors.gray[100], color: colors.text.secondary, cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendAnnouncement}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: colors.primary[600], color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default FloatingActionButton;
