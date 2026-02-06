// src/components/Auth/LoginPage.js
// Login page for all user types

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, AlertCircle, Loader } from "lucide-react";
import { colors, shadows, gradients } from "../../styles/colors";

import Logo from "../Common/Logo"; // Imported Logo

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(formData.email.trim(), formData.password, rememberMe);

    if (!result.success) {
      setError(result.error);
      return;
    }

    const role = result.user.role;

    // Use a short timeout to ensure AuthContext state updates propagate
    // before the ProtectedRoute checks the user status.
    setTimeout(() => {
      switch (role) {
        case "citizen":
          navigate("/citizen/dashboard");
          break;
        case "volunteer":
          navigate("/volunteer/dashboard");
          break;
        case "ngo":
          navigate("/ngo/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    }, 100);
  };

  return (
    <div
      className="login-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: colors.background.secondary,
      }}
    >
      {/* Left Side - Branding */}
      <div
        className="login-branding"
        style={{
          flex: 1,
          background: gradients.hero,
          color: "white",
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "500px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <Logo size={80} />
            UrbanMind
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              opacity: 0.95,
              lineHeight: "1.6",
            }}
          >
            Welcome back! Login to continue making a difference in your
            community.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        className="login-form-container"
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "450px",
            backgroundColor: colors.background.primary,
            padding: "3rem",
            borderRadius: "16px",
            boxShadow: shadows.xl,
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: colors.text.primary,
                marginBottom: "0.5rem",
              }}
            >
              Login to Your Account
            </h2>
            <p
              style={{
                color: colors.text.secondary,
                fontSize: "0.95rem",
              }}
            >
              Enter your credentials to access your dashboard
            </p>
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

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
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
                Email Address
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
                    transition: "border-color 0.3s",
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

            {/* Password Input */}
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
                Password
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
                  placeholder="Enter your password"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 3rem",
                    borderRadius: "8px",
                    border: `2px solid ${colors.border.default}`,
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.3s",
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

            {/* Remember Me & Forgot Password */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  color: colors.text.secondary,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "0.9rem",
                  color: colors.primary[500],
                  textDecoration: "none",
                  fontWeight: "600",
                }}
              >
                Forgot Password?
              </Link>
            </div>

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
                transition: "all 0.3s",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.transform = "translateY(0)";
              }}
            >
              {loading ? (
                <>
                  <Loader
                    size={20}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Register Link */}
          <div
            style={{
              marginTop: "2rem",
              textAlign: "center",
              fontSize: "0.95rem",
              color: colors.text.secondary,
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: colors.primary[500],
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Register Now
            </Link>
          </div>

          {/* Back to Home */}
          <div
            style={{
              marginTop: "1rem",
              textAlign: "center",
            }}
          >
            <Link
              to="/"
              style={{
                fontSize: "0.9rem",
                color: colors.text.secondary,
                textDecoration: "none",
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Add spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .login-container {
            flex-direction: column !important;
          }
          .login-branding {
            padding: 2rem !important;
            flex: 0 0 auto !important;
          }
           .login-branding h1 {
            fontSize: 2.25rem !important;
          }
          .login-branding p {
            fontSize: 1rem !important;
            display: none !important; /* Optional: hide subtext on mobile to save space */
          }
          .login-form-container {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
