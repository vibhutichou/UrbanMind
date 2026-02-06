// src/components/Auth/LandingPage.js
// Beautiful landing page for UrbanMind

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Users, Heart, TrendingUp, Shield, MapPin } from 'lucide-react';
import { colors, gradients, shadows } from '../../styles/colors';

import Logo from '../Common/Logo'; // Imported Logo

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Camera size={40} />,
      title: 'Report Problems',
      description: 'Click photos and report civic issues in your area - potholes, stray animals, leftover food, and more.'
    },
    {
      icon: <Users size={40} />,
      title: 'Community Action',
      description: 'Connect with volunteers, NGOs, and government officials to solve problems together.'
    },
    {
      icon: <Heart size={40} />,
      title: 'Donate & Support',
      description: 'Support causes you care about with transparent tracking of funds and impact.'
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Track Progress',
      description: 'View real-time timelines of problem resolution, from reporting to completion.'
    },
    {
      icon: <Shield size={40} />,
      title: 'Verified Volunteers',
      description: 'All volunteers and NGOs are document-verified to ensure genuine community service.'
    },
    {
      icon: <MapPin size={40} />,
      title: 'Location-Based',
      description: 'Find and solve problems in your neighborhood with precise location tracking.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Problems Solved' },
    { number: '5K+', label: 'Active Volunteers' },
    { number: '500+', label: 'NGO Partners' },
    { number: '₹50L+', label: 'Funds Raised' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background.secondary }}>
      {/* Navbar */}
      <nav style={{
        padding: '1rem 2rem',
        backgroundColor: colors.background.primary,
        boxShadow: shadows.sm,
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            background: gradients.hero,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Logo size={50} />
            UrbanMind
          </div>

          <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1.5rem)',
                borderRadius: '8px',
                border: `2px solid ${colors.primary[500]}`,
                backgroundColor: 'transparent',
                color: colors.primary[500],
                fontWeight: '600',
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = colors.primary[50]}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.75rem, 2vw, 1.5rem)',
                borderRadius: '8px',
                border: 'none',
                background: gradients.primary,
                color: 'white',
                fontWeight: '600',
                fontSize: 'clamp(0.8rem, 2vw, 1rem)',
                cursor: 'pointer',
                boxShadow: shadows.md,
                transition: 'all 0.3s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '6rem 2rem',
        background: gradients.hero,
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Connecting Communities,<br />Solving Problems Together
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            opacity: 0.95,
            lineHeight: '1.6'
          }}>
            Report civic issues, track solutions, donate to causes, and build a better city.
            Join thousands of citizens, volunteers, and NGOs making a real difference.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '1rem 2.5rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: 'white',
                color: colors.primary[600],
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: shadows.lg,
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = shadows.xl;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = shadows.lg;
              }}
            >
              Start Reporting Issues
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '1rem 2.5rem',
                borderRadius: '10px',
                border: '2px solid white',
                backgroundColor: 'transparent',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Login as Volunteer
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: '3rem 2rem',
        backgroundColor: colors.background.primary
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center'
        }}>
          {stats.map((stat, index) => (
            <div key={index}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: colors.primary[600],
                marginBottom: '0.5rem'
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: '1rem',
                color: colors.text.secondary,
                fontWeight: '600'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '5rem 2rem',
        backgroundColor: colors.background.secondary
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '1rem',
            color: colors.text.primary
          }}>
            How UrbanMind Works
          </h2>
          <p style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            color: colors.text.secondary,
            marginBottom: '4rem',
            maxWidth: '600px',
            margin: '0 auto 4rem'
          }}>
            A complete platform for civic engagement and community problem-solving
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: '2rem',
                  backgroundColor: colors.background.primary,
                  borderRadius: '12px',
                  boxShadow: shadows.card,
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = shadows.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = shadows.card;
                }}
              >
                <div style={{
                  color: colors.primary[500],
                  marginBottom: '1rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  color: colors.text.primary
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: colors.text.secondary,
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '5rem 2rem',
        background: gradients.primary,
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            Ready to Make a Difference?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '2.5rem',
            opacity: 0.95
          }}>
            Join thousands of citizens, volunteers, and NGOs creating positive change in their communities.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '1rem 3rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'white',
              color: colors.primary[600],
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: shadows.xl,
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Join UrbanMind Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        backgroundColor: colors.gray[900],
        color: colors.gray[400],
        textAlign: 'center'
      }}>
        <p>© 2024 UrbanMind. Built with ❤️ for better communities.</p>
      </footer>
    </div>
  );
};

export default LandingPage;