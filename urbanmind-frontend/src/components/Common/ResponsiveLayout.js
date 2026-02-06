// src/components/Common/ResponsiveLayout.js
// Responsive wrapper for all dashboards

import React, { useState } from 'react';
import SidebarActual from './Sidebar';
import ChatFloatingButtonActual from './ChatFloatingButton';
import FloatingActionButtonActual from './FloatingActionButton';
import { Menu, X } from 'lucide-react';
import { colors } from '../../styles/colors';

import Logo from './Logo'; // Imported Logo

// Safety checks for imported components
const Sidebar = SidebarActual || (() => { console.error('Sidebar is undefined'); return <div style={{ color: 'red', padding: 20 }}>Sidebar Error</div>; });
const ChatFloatingButton = ChatFloatingButtonActual || (() => { console.error('ChatFloatingButton is undefined'); return null; });
const FloatingActionButton = FloatingActionButtonActual || (() => { console.error('FloatingActionButton is undefined'); return <div style={{ color: 'red', padding: 10, border: '1px solid red' }}>FAB Error</div>; });

const ResponsiveLayout = ({ children, showRightSidebar = true, rightSidebarContent, fullWidth = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div style={{
        display: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: colors.background.primary,
        borderBottom: `1px solid ${colors.border.light}`,
        padding: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
        className="mobile-header"
      >
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            padding: '0.5rem',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Menu size={24} color={colors.text.primary} />
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Logo size={40} />
          <span style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #0073e6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            UrbanMind
          </span>
        </div>
        <div style={{ width: '40px' }} /> {/* Spacer for centering */}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 998
            }}
            className="mobile-overlay"
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '275px',
              backgroundColor: colors.background.primary,
              zIndex: 999,
              overflowY: 'auto',
              animation: 'slideInLeft 0.3s ease-out'
            }}
            className="mobile-sidebar"
          >
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '1rem'
            }}>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                <X size={24} color={colors.text.primary} />
              </button>
            </div>
            <Sidebar isEmbedded={true} onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </>
      )}

      {/* Main Layout */}
      <div
        className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 main-layout transition-colors duration-300"
      >
        <div className="desktop-sidebar shrink-0 w-[275px] dark:border-r dark:border-gray-800 sticky top-0 h-screen overflow-y-auto">
          <Sidebar isEmbedded={true} />
        </div>

        {/* Main Content */}
        <main
          className="flex-1 min-h-screen bg-white dark:bg-gray-900 main-content transition-colors duration-300"
          style={{
            maxWidth: fullWidth ? '100%' : '600px',
            borderLeft: '1px solid var(--tw-border-opacity, 0.1)', // simplified border handling
            borderRight: showRightSidebar ? '1px solid var(--tw-border-opacity, 0.1)' : 'none',
          }}
        >
          {children}
        </main>

        {/* Right Sidebar */}
        {showRightSidebar && rightSidebarContent && (
          <aside
            className="flex-1 p-4 max-w-[350px] min-h-screen bg-white dark:bg-gray-900 overflow-y-auto right-sidebar border-l border-gray-100 dark:border-gray-800 transition-colors duration-300"
          >
            <div className="sticky top-4">
              {rightSidebarContent}
            </div>
          </aside>
        )}
      </div>
      <ChatFloatingButton hidden={fabOpen} />
      <FloatingActionButton onToggle={setFabOpen} />

      <style>{`
        /* Mobile: < 768px */
        @media (max-width: 767px) {
          .mobile-header {
            display: flex !important;
          }
          .main-layout {
            flex-direction: column !important;
          }
          .desktop-sidebar {
            display: none !important;
          }
          .right-sidebar {
            display: block !important;
            max-width: 100% !important;
            width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            border-left: none !important;
            border-top: 1px solid ${colors.border.light};
            /* order: -1;  Removed to keep it below main content */
          }
          .main-content {
            max-width: 100% !important;
            border-right: none !important;
          }
        }

        /* Tablet: 768px - 1024px */
        @media (min-width: 768px) and (max-width: 1024px) {
          .desktop-sidebar {
            display: block !important;
          }
          .right-sidebar {
            display: none !important;
          }
          .main-content {
            border-right: none !important;
          }
        }

        /* Desktop: > 1024px */
        @media (min-width: 1025px) {
          .desktop-sidebar {
            display: block !important;
          }
          .right-sidebar {
            display: block !important;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default ResponsiveLayout;