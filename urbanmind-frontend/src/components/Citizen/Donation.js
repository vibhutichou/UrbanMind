// src/components/Citizen/Donation.js
// Donation page – same visual language as CreatePost

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getThemeForRole } from '../../styles/theme';
import {
  Gift,
  MapPin,
  Camera,
  X,
  CheckCircle2,
  AlertCircle,
  Loader
} from 'lucide-react';
import { colors, shadows } from '../../styles/colors';

const Donation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = getThemeForRole(user?.role);

  const [formData, setFormData] = useState({
    type: '',
    quantity: '',
    location: '',
    image: null
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const donationTypes = [
    { value: 'food', label: 'Food', emoji: '🍲' },
    { value: 'clothes', label: 'Clothes', emoji: '👕' },
    { value: 'money', label: 'Money', emoji: '💰' }
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData({ ...formData, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.type) return setError('Select donation type');
    if (!formData.quantity.trim()) return setError('Enter quantity / amount');
    if (!formData.location.trim()) return setError('Enter pickup location');

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/citizen/dashboard'), 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.secondary
      }}>
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '3rem',
          borderRadius: '16px',
          boxShadow: shadows.xl,
          textAlign: 'center'
        }}>
          <CheckCircle2 size={64} color={colors.success} />
          <h2 style={{ marginTop: '1rem', fontSize: '1.6rem', fontWeight: '700' }}>
            Donation Submitted!
          </h2>
          <p style={{ color: colors.text.secondary }}>
            NGOs and volunteers will contact you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.background.secondary,
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: '1.5rem',
            border: 'none',
            background: 'transparent',
            color: colors.text.secondary,
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>

        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>
          Make a Donation
        </h1>
        <p style={{ color: colors.text.secondary, marginBottom: '2rem' }}>
          Help your community by donating essentials
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: colors.background.primary,
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: shadows.lg
          }}>
            {error && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: colors.error + '10',
                color: colors.error,
                display: 'flex',
                gap: '0.5rem'
              }}>
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Donation Type */}
            <label style={{ fontWeight: '600' }}>
              <Gift size={16} /> Donation Type *
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
              margin: '1rem 0'
            }}>
              {donationTypes.map(d => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: d.value })}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: `2px solid ${formData.type === d.value ? theme.primary : colors.border.light}`,
                    backgroundColor: formData.type === d.value ? theme.light : 'transparent',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  <div style={{ fontSize: '1.8rem' }}>{d.emoji}</div>
                  {d.label}
                </button>
              ))}
            </div>

            {/* Quantity */}
            <input
              type="text"
              placeholder="Quantity / Amount"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              style={{
                width: '100%',
                padding: '0.9rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                border: `2px solid ${colors.border.default}`
              }}
            />

            {/* Location */}
            <input
              type="text"
              placeholder="Pickup Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={{
                width: '100%',
                padding: '0.9rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                border: `2px solid ${colors.border.default}`
              }}
            />

            {/* Image Upload */}
            <label style={{ fontWeight: '600' }}>
              <Camera size={16} /> Optional Image
            </label>
            <div style={{ marginTop: '0.75rem' }}>
              {preview ? (
                <div style={{ position: 'relative', width: '150px' }}>
                  <img src={preview} alt="preview" style={{ width: '100%', borderRadius: '12px' }} />
                  <button
                    type="button"
                    onClick={() => { setPreview(null); setFormData({ ...formData, image: null }); }}
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      background: colors.error,
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <input type="file" accept="image/*" onChange={handleImage} />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '1.5rem',
              padding: '1.2rem',
              borderRadius: '12px',
              border: 'none',
              background: loading ? colors.gray[400] : theme.gradient,
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? <Loader size={22} /> : 'Submit Donation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Donation;
