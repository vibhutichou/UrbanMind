// src/components/Citizen/CreatePost.js
// Beautiful form to report problems with image upload

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getThemeForRole } from '../../styles/theme';
import { 
  Camera, 
  MapPin, 
  Tag, 
  X, 
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader
} from 'lucide-react';
import { colors, shadows } from '../../styles/colors';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = getThemeForRole(user?.role);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    images: []
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️', color: colors.primary[500] },
    { value: 'sanitation', label: 'Sanitation', icon: '🧹', color: colors.success },
    { value: 'animals', label: 'Animals', icon: '🐕', color: colors.accent.orange },
    { value: 'food', label: 'Food Donation', icon: '🍲', color: colors.accent.pink },
    { value: 'safety', label: 'Safety', icon: '🚨', color: colors.error },
    { value: 'environment', label: 'Environment', icon: '🌳', color: colors.secondary[500] },
    { value: 'other', label: 'Other', icon: '📋', color: colors.gray[500] }
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imagePreview.length > 4) {
      setError('Maximum 4 images allowed');
      return;
    }

    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImagePreview([...imagePreview, ...newPreviews]);
    setFormData({ ...formData, images: [...formData.images, ...files] });
    setError('');
  };

  const removeImage = (index) => {
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    const newImages = formData.images.filter((_, i) => i !== index);
    setImagePreview(newPreviews);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please enter a location');
      return;
    }
    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/citizen/dashboard');
      }, 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background.secondary,
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: colors.background.primary,
          padding: '3rem',
          borderRadius: '16px',
          boxShadow: shadows.xl,
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: colors.success + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <CheckCircle2 size={48} color={colors.success} />
          </div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            color: colors.text.primary,
            marginBottom: '0.75rem'
          }}>
            Problem Reported Successfully!
          </h2>
          <p style={{
            fontSize: '1rem',
            color: colors.text.secondary,
            lineHeight: '1.6'
          }}>
            Your report has been submitted. Volunteers and NGOs in your area will be notified.
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
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: `1px solid ${colors.border.default}`,
              backgroundColor: 'transparent',
              color: colors.text.secondary,
              fontSize: '0.9rem',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.gray[100];
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            ← Back
          </button>

          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: colors.text.primary,
            marginBottom: '0.5rem'
          }}>
            Report a Problem
          </h1>
          <p style={{
            fontSize: '1rem',
            color: colors.text.secondary
          }}>
            Help improve your community by reporting issues
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: colors.background.primary,
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: shadows.lg,
            marginBottom: '1.5rem'
          }}>
            {/* Error Message */}
            {error && (
              <div style={{
                padding: '1rem',
                backgroundColor: colors.error + '10',
                border: `1px solid ${colors.error}`,
                borderRadius: '8px',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <AlertCircle size={20} color={colors.error} />
                <span style={{ color: colors.error, fontSize: '0.9rem' }}>{error}</span>
              </div>
            )}

            {/* Title */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: '0.5rem'
              }}>
                Problem Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Large pothole on MG Road"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '8px',
                  border: `2px solid ${colors.border.default}`,
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border.default}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: '0.5rem'
              }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the problem in detail..."
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '8px',
                  border: `2px solid ${colors.border.default}`,
                  fontSize: '1rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border.default}
              />
            </div>

            {/* Category Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: '0.75rem'
              }}>
                <Tag size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Category *
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '0.75rem'
              }}>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      border: `2px solid ${formData.category === cat.value ? cat.color : colors.border.light}`,
                      backgroundColor: formData.category === cat.value ? cat.color + '10' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (formData.category !== cat.value) {
                        e.target.style.backgroundColor = colors.gray[50];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.category !== cat.value) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{cat.icon}</div>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: formData.category === cat.value ? cat.color : colors.text.primary
                    }}>
                      {cat.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: '0.5rem'
              }}>
                <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., MG Road, Bangalore"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: '8px',
                  border: `2px solid ${colors.border.default}`,
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = theme.primary}
                onBlur={(e) => e.target.style.borderColor = colors.border.default}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: colors.text.primary,
                marginBottom: '0.75rem'
              }}>
                <Camera size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                Upload Images * (Max 4)
              </label>

              {/* Image Previews */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                {imagePreview.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      paddingBottom: '100%',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: `2px solid ${colors.border.light}`
                    }}
                  >
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: colors.error,
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: shadows.md
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                {imagePreview.length < 4 && (
                  <label
                    style={{
                      position: 'relative',
                      paddingBottom: '100%',
                      borderRadius: '12px',
                      border: `2px dashed ${colors.border.default}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = theme.primary;
                      e.currentTarget.style.backgroundColor = theme.light;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = colors.border.default;
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}>
                      <Upload size={32} color={colors.text.secondary} style={{ marginBottom: '0.5rem' }} />
                      <div style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: colors.text.secondary
                      }}>
                        Upload
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: loading ? colors.gray[400] : theme.gradient,
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: shadows.lg,
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.transform = 'translateY(0)';
            }}
          >
            {loading ? (
              <>
                <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                Submitting...
              </>
            ) : (
              <>
                <Camera size={24} />
                Submit Report
              </>
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CreatePost;