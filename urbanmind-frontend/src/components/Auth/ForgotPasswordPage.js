import React, { useState } from "react";
import { Mail, Lock, ArrowLeft, Check, AlertCircle } from "lucide-react";
import api from "../../api/axios";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const colors = {
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    background: "#ffffff",
    text: "#1f2937",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    error: "#ef4444",
    success: "#10b981",
    inputBg: "#f9fafb",
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const sendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });

      setSuccess("OTP sent successfully! Check your email.");
      setTimeout(() => {
        setStep(2);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      setSuccess("Password reset successfully!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setError(err.response?.data || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter" && !loading) {
      action();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "2.5rem",
          background: colors.background,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          borderRadius: "16px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 4px 6px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Lock size={32} color="white" />
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.875rem",
              fontWeight: "700",
              color: colors.text,
            }}
          >
            {step === 1 ? "Forgot Password?" : "Reset Password"}
          </h2>
          <p
            style={{
              margin: "0.5rem 0 0",
              fontSize: "0.875rem",
              color: colors.textSecondary,
            }}
          >
            {step === 1
              ? "Enter your email to receive a verification code"
              : "Enter the OTP and your new password"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: colors.primary,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              fontWeight: "600",
            }}
          >
            {step > 1 ? <Check size={16} /> : "1"}
          </div>
          <div
            style={{
              width: "48px",
              height: "2px",
              background: step === 2 ? colors.primary : colors.border,
            }}
          />
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: step === 2 ? colors.primary : colors.border,
              color: step === 2 ? "white" : colors.textSecondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              fontWeight: "600",
            }}
          >
            2
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "#fee2e2",
              border: `1px solid ${colors.error}`,
              borderRadius: "8px",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <AlertCircle size={18} color={colors.error} />
            <span style={{ fontSize: "0.875rem", color: colors.error }}>
              {error}
            </span>
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "#d1fae5",
              border: `1px solid ${colors.success}`,
              borderRadius: "8px",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Check size={18} color={colors.success} />
            <span style={{ fontSize: "0.875rem", color: colors.success }}>
              {success}
            </span>
          </div>
        )}

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: colors.text,
                marginBottom: "0.5rem",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative", marginBottom: "1.5rem" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: colors.textSecondary,
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, sendOtp)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.75rem",
                  fontSize: "1rem",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  outline: "none",
                  transition: "all 0.2s",
                  background: colors.inputBg,
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = colors.primary)}
                onBlur={(e) => (e.target.style.borderColor = colors.border)}
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                fontSize: "1rem",
                fontWeight: "600",
                color: "white",
                background: loading ? colors.textSecondary : colors.primary,
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: "0 2px 4px rgba(99, 102, 241, 0.2)",
              }}
              onMouseEnter={(e) =>
                !loading && (e.target.style.background = colors.primaryHover)
              }
              onMouseLeave={(e) =>
                !loading && (e.target.style.background = colors.primary)
              }
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </div>
        )}

        {/* Step 2: OTP and New Password */}
        {step === 2 && (
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: colors.text,
                marginBottom: "0.5rem",
              }}
            >
              Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                fontSize: "1rem",
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                outline: "none",
                marginBottom: "1rem",
                background: colors.inputBg,
                textAlign: "center",
                letterSpacing: "0.5rem",
                fontWeight: "600",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = colors.primary)}
              onBlur={(e) => (e.target.style.borderColor = colors.border)}
            />

            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: colors.text,
                marginBottom: "0.5rem",
              }}
            >
              New Password
            </label>
            <div style={{ position: "relative", marginBottom: "1rem" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: colors.textSecondary,
                }}
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.75rem",
                  fontSize: "1rem",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  outline: "none",
                  background: colors.inputBg,
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = colors.primary)}
                onBlur={(e) => (e.target.style.borderColor = colors.border)}
              />
            </div>

            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: colors.text,
                marginBottom: "0.5rem",
              }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative", marginBottom: "1.5rem" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: colors.textSecondary,
                }}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, resetPassword)}
                placeholder="Confirm new password"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem 0.75rem 2.75rem",
                  fontSize: "1rem",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  outline: "none",
                  background: colors.inputBg,
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = colors.primary)}
                onBlur={(e) => (e.target.style.borderColor = colors.border)}
              />
            </div>

            <button
              onClick={resetPassword}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                fontSize: "1rem",
                fontWeight: "600",
                color: "white",
                background: loading ? colors.textSecondary : colors.primary,
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                boxShadow: "0 2px 4px rgba(99, 102, 241, 0.2)",
              }}
              onMouseEnter={(e) =>
                !loading && (e.target.style.background = colors.primaryHover)
              }
              onMouseLeave={(e) =>
                !loading && (e.target.style.background = colors.primary)
              }
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              onClick={() => {
                setStep(1);
                // setOtp('');
                setNewPassword("");
                setConfirmPassword("");
                setError("");
                sendOtp();
              }}
              style={{
                width: "100%",
                padding: "0.875rem",
                marginTop: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: colors.primary,
                background: "transparent",
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.background = colors.inputBg)}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              Resend Code
            </button>
          </div>
        )}

        {/* Back to Login */}
        <div
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
          }}
        >
          <a
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              color: colors.primary,
              textDecoration: "none",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
          >
            <ArrowLeft size={16} />
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
