// src/components/Auth/RegisterPage.js
// Registration page with role selection (Citizen, Volunteer, NGO)

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  AlertCircle,
  Loader,
  Building2,
  Heart,
} from "lucide-react";
import { colors, shadows, gradients } from "../../styles/colors";

import Logo from "../Common/Logo"; // Imported Logo

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [step, setStep] = useState(1); // Step 1: Role selection, Step 2: Details
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    role: "",
  });
  const [error, setError] = useState("");

  const roles = [
    {
      value: "citizen",
      title: "Citizen",
      icon: <User size={48} />,
      color: colors.roles.citizen,
      description:
        "Report problems, donate to causes, and track solutions in your community.",
    },
    {
      value: "volunteer",
      title: "Volunteer",
      icon: <Heart size={48} />,
      color: colors.roles.volunteer,
      description:
        "Take action on reported issues, earn levels, and make a real impact.",
    },
    {
      value: "ngo",
      title: "NGO",
      icon: <Building2 size={48} />,
      color: colors.roles.ngo,
      description:
        "Manage teams, coordinate large-scale solutions, and lead community initiatives.",
    },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    if (!formData.email.endsWith("@gmail.com")) {
      setError("Only @gmail.com email is allowed");
      return false;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Phone number must be exactly 10 digits");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    // Call register from AuthContext
    const result = await register(formData);
    if (result.success) {
      navigate("/login"); // always go to login after registration
    } else {
      let errorMessage = result.error;

      // Handle object errors (e.g. backend returns { message: "..." })
      if (typeof result.error === "object" && result.error !== null) {
        errorMessage =
          result.error.message ||
          result.error.error ||
          JSON.stringify(result.error);
      }

      // Check for specific keywords to provide better user feedback
      if (typeof errorMessage === "string") {
        const lowerError = errorMessage.toLowerCase();

        if (
          lowerError.includes("phone") &&
          (lowerError.includes("duplicate") ||
            lowerError.includes("exists") ||
            lowerError.includes("taken") ||
            lowerError.includes("already"))
        ) {
          errorMessage =
            "This phone number is already registered. Please use a different number or login.";
        } else if (
          lowerError.includes("email") &&
          (lowerError.includes("duplicate") ||
            lowerError.includes("exists") ||
            lowerError.includes("taken") ||
            lowerError.includes("already"))
        ) {
          errorMessage = "This email is already registered. Please login.";
        }
      }

      setError(errorMessage || "Registration failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: colors.background.secondary,
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 2rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            background: gradients.hero,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Logo size={60} />
          UrbanMind
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: colors.text.secondary,
          }}
        >
          Choose your role and start making a difference
        </p>
      </div>

      {/* Progress Indicator */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: step >= 1 ? colors.primary[500] : colors.gray[300],
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
          }}
        >
          1
        </div>
        <div
          style={{
            flex: 1,
            height: "4px",
            backgroundColor: step >= 2 ? colors.primary[500] : colors.gray[300],
            borderRadius: "2px",
          }}
        />
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: step >= 2 ? colors.primary[500] : colors.gray[300],
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
          }}
        >
          2
        </div>
      </div>

      {/* Step 1: Role Selection */}
      {step === 1 && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "2rem",
              color: colors.text.primary,
            }}
          >
            Select Your Role
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {roles.map((role) => (
              <div
                key={role.value}
                onClick={() => handleRoleSelect(role.value)}
                style={{
                  backgroundColor: colors.background.primary,
                  padding: "2.5rem",
                  borderRadius: "16px",
                  boxShadow: shadows.card,
                  cursor: "pointer",
                  transition: "all 0.3s",
                  border: `3px solid ${selectedRole === role.value ? role.color : "transparent"}`,
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = shadows.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = shadows.card;
                }}
              >
                <div
                  style={{
                    color: role.color,
                    marginBottom: "1rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {role.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    marginBottom: "1rem",
                    color: colors.text.primary,
                  }}
                >
                  {role.title}
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: colors.text.secondary,
                    lineHeight: "1.6",
                  }}
                >
                  {role.description}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
            }}
          >
            <Link
              to="/login"
              style={{
                fontSize: "0.95rem",
                color: colors.text.secondary,
                textDecoration: "none",
              }}
            >
              Already have an account?{" "}
              <span style={{ color: colors.primary[500], fontWeight: "600" }}>
                Login
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Step 2: Registration Form */}
      {step === 2 && (
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: colors.background.primary,
            padding: "3rem",
            borderRadius: "16px",
            boxShadow: shadows.xl,
          }}
        >
          <button
            onClick={() => setStep(1)}
            style={{
              marginBottom: "1.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: `1px solid ${colors.border.default}`,
              backgroundColor: "transparent",
              color: colors.text.secondary,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            ← Change Role
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "2rem",
              padding: "1rem",
              backgroundColor: colors.gray[50],
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                color: roles.find((r) => r.value === selectedRole)?.color,
              }}
            >
              {roles.find((r) => r.value === selectedRole)?.icon}
            </div>
            <div>
              <div
                style={{ fontSize: "0.85rem", color: colors.text.secondary }}
              >
                Registering as
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: colors.text.primary,
                }}
              >
                {roles.find((r) => r.value === selectedRole)?.title}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#fee2e2",
                border: `1px solid ${colors.error}`,
                borderRadius: "8px",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <AlertCircle size={20} color={colors.error} />
              <span style={{ color: colors.error, fontSize: "0.9rem" }}>
                {error}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: colors.text.primary,
                }}
              >
                Full Name *
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={20}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors.text.secondary,
                  }}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 3rem",
                    borderRadius: "8px",
                    border: `2px solid ${colors.border.default}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = colors.primary[500])
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = colors.border.default)
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: colors.text.primary,
                }}
              >
                Email Address *
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={20}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors.text.secondary,
                  }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 3rem",
                    borderRadius: "8px",
                    border: `2px solid ${colors.border.default}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = colors.primary[500])
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = colors.border.default)
                  }
                />
              </div>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: colors.text.primary,
                }}
              >
                Phone Number *
              </label>
              <div style={{ position: "relative" }}>
                <Phone
                  size={20}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors.text.secondary,
                  }}
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 1234567890"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 3rem",
                    borderRadius: "8px",
                    border: `2px solid ${colors.border.default}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = colors.primary[500])
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = colors.border.default)
                  }
                />
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: colors.text.primary,
                }}
              >
                Location *
              </label>
              <div style={{ position: "relative" }}>
                <MapPin
                  size={20}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors.text.secondary,
                  }}
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 3rem",
                    borderRadius: "8px",
                    border: `2px solid ${colors.border.default}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = colors.primary[500])
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = colors.border.default)
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: colors.text.primary,
                }}
              >
                Password *
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={20}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors.text.secondary,
                  }}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 3rem",
                    borderRadius: "8px",
                    border: `2px solid ${colors.border.default}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = colors.primary[500])
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = colors.border.default)
                  }
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: colors.text.primary,
                }}
              >
                Confirm Password *
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={20}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: colors.text.secondary,
                  }}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 3rem",
                    borderRadius: "8px",
                    border: `2px solid ${colors.border.default}`,
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = colors.primary[500])
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = colors.border.default)
                  }
                />
              </div>
            </div>

            {/* Verification Note for Volunteers/NGOs */}
            {(selectedRole === "volunteer" || selectedRole === "ngo") && (
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: colors.warning + "20",
                  border: `1px solid ${colors.warning}`,
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  fontSize: "0.9rem",
                  color: colors.text.primary,
                }}
              >
                <strong>Note:</strong>{" "}
                {selectedRole === "volunteer" ? "Volunteers" : "NGOs"} require
                document verification before full access.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "8px",
                border: "none",
                background: loading ? colors.gray[400] : gradients.primary,
                color: "white",
                fontSize: "1rem",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: shadows.md,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {loading ? (
                <>
                  <Loader
                    size={20}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div
            style={{
              marginTop: "2rem",
              textAlign: "center",
              fontSize: "0.95rem",
              color: colors.text.secondary,
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: colors.primary[500],
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
