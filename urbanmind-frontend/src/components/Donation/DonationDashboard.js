import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "../Common/ResponsiveLayout";
import { useAuth } from "../../context/AuthContext";
import { DollarSign, Award, TrendingUp, Heart, MapPin, ArrowRight } from "lucide-react";
import { colors } from "../../styles/colors";
import { getAllDonations } from "../../services/donationService";
import api from "../../api/axios";

const DonationDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]); // Projects accepting donations
  const [loading, setLoading] = useState(true);

  // Stats (Mock for now, could be real AP call)
  const stats = {
    totalDonated: 12500,
    livesImpacted: 45,
    badges: ["Top Donor", "Early Backer"]
  };

  useEffect(() => {
    // Fetch Projects that need donation
    // In real app: api.get(`/problems/donation-required`)
    // Mocking the feed for now as we don't have a specific "FEED" endpoint verified
    const fetchFeed = async () => {
      try {
        const response = await api.get(`/problems/donation-required`);
        if (response.data.success) {
          // Map backend data to frontend structure
          const mappedProjects = response.data.data.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            raised: p.amountRaised || 0,
            target: p.targetAmount || p.requiredAmount || 0,
            image: p.imageUrl || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800", // Fallback image if not in DB
            category: p.category
          }));
          setProjects(mappedProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Keep mock data or show empty state on error? For now, showing empty is safer to detect failure
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  return (
    <ResponsiveLayout fullWidth={true} showRightSidebar={false}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: colors.background.secondary,
        // overflow: "hidden" // Removed to allow ResponsiveLayout to control
      }}>

        {/* Container for Split View */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr", // 50/50 Split
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          height: "100%"
        }}>

          {/* Left Side - Personal Stats (Premium Design) */}
          <div style={{
            padding: "40px",
            backgroundColor: "#fff",
            borderRight: `1px solid ${colors.border.light}`,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "30px"
          }}>

            {/* Profile Header */}
            <div style={{
              textAlign: "center",
              padding: "30px",
              background: `linear-gradient(135deg, ${colors.primary[50]} 0%, #ffffff 100%)`,
              borderRadius: "24px",
              border: `1px solid ${colors.primary[100]}`
            }}>
              <div style={{
                width: "96px", height: "96px", borderRadius: "50%", margin: "0 auto 20px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "white",
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)"
              }}>
                <DollarSign size={48} />
              </div>
              <h2 style={{ margin: "0 0 10px 0", fontSize: "2rem", color: colors.text.primary, fontWeight: "800" }}>My Impact</h2>
              <p style={{ margin: 0, color: colors.text.secondary, fontSize: "1.1rem" }}>Making the world better, one contribution at a time.</p>
            </div>

            {/* Stats Grid */}
            <div>
              <h3 style={{ fontSize: "0.85rem", color: colors.text.secondary, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700", marginBottom: "20px" }}>
                Lifestyle Stats
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{
                  padding: "25px",
                  backgroundColor: colors.background.primary,
                  borderRadius: "20px",
                  border: `1px solid ${colors.border.light}`,
                  transition: "transform 0.2s",
                  cursor: "default"
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    backgroundColor: colors.primary[50], color: colors.primary[600],
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px"
                  }}>
                    <TrendingUp size={24} />
                  </div>
                  <div style={{ fontWeight: "800", fontSize: "1.75rem", color: colors.text.primary, marginBottom: "5px" }}>
                    ₹{stats.totalDonated.toLocaleString()}
                  </div>
                  <span style={{ fontSize: "0.95rem", color: colors.text.secondary, fontWeight: "600" }}>Total Donated</span>
                </div>

                <div style={{
                  padding: "25px",
                  backgroundColor: colors.background.primary,
                  borderRadius: "20px",
                  border: `1px solid ${colors.border.light}`,
                  transition: "transform 0.2s",
                  cursor: "default"
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    backgroundColor: "#fce7f3", color: "#ec4899",
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px"
                  }}>
                    <Heart size={24} />
                  </div>
                  <div style={{ fontWeight: "800", fontSize: "1.75rem", color: colors.text.primary, marginBottom: "5px" }}>
                    {stats.livesImpacted}
                  </div>
                  <span style={{ fontSize: "0.95rem", color: colors.text.secondary, fontWeight: "600" }}>Lives Impacted</span>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div>
              <h3 style={{ fontSize: "0.85rem", color: colors.text.secondary, textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "700", marginBottom: "20px" }}>
                Achievements
              </h3>
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                {stats.badges.map((badge, idx) => (
                  <div key={idx} style={{
                    padding: "12px 20px", borderRadius: "16px",
                    background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                    border: "1px solid #fcd34d",
                    color: "#b45309", fontSize: "0.95rem", fontWeight: "700",
                    display: "flex", alignItems: "center", gap: "10px",
                    boxShadow: "0 4px 6px rgba(251, 191, 36, 0.1)"
                  }}>
                    <Award size={20} /> {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Donation Feed */}
          <div style={{
            padding: "40px",
            overflowY: "auto", // Independent scrolling
            backgroundColor: colors.background.secondary
          }}>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <h1 style={{ marginBottom: "15px", fontSize: "2.5rem", fontWeight: "800", color: colors.text.primary }}>
                Active Campaigns 🌍
              </h1>
              <p style={{ color: colors.text.secondary, fontSize: "1.1rem", marginBottom: "40px", lineHeight: "1.6" }}>
                Support verified projects from NGOs in your community. Your contributions directly help those in need.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                {loading ? <p>Loading projects...</p> : projects.map(project => (
                  <div key={project.id} style={{
                    backgroundColor: "#fff", borderRadius: "24px", overflow: "hidden",
                    boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.08)", display: "flex", flexDirection: "column",
                    transition: "transform 0.2s"
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div style={{ height: "240px", overflow: "hidden", position: "relative" }}>
                      <img src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{
                        position: "absolute", top: "20px", left: "20px",
                        backgroundColor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(4px)",
                        padding: "8px 16px", borderRadius: "12px",
                        fontSize: "0.85rem", fontWeight: "700", color: colors.primary[600],
                        display: "flex", alignItems: "center", gap: "6px"
                      }}>
                        <MapPin size={14} /> {project.category}
                      </div>
                    </div>

                    <div style={{ padding: "30px" }}>
                      <h3 style={{ margin: "0 0 15px 0", fontSize: "1.5rem", color: colors.text.primary, fontWeight: "800" }}>{project.title}</h3>

                      <p style={{ color: colors.text.secondary, fontSize: "1rem", lineHeight: "1.6", marginBottom: "25px" }}>
                        {project.description}
                      </p>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: "25px", padding: "20px", backgroundColor: colors.gray[50], borderRadius: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
                          <span style={{ fontWeight: "800", color: colors.text.primary, fontSize: "1.2rem" }}>₹{project.raised.toLocaleString()}</span>
                          <span style={{ color: colors.text.secondary, fontSize: "0.9rem", fontWeight: "500" }}>raised of ₹{project.target.toLocaleString()} goal</span>
                        </div>
                        <div style={{ width: "100%", height: "10px", backgroundColor: colors.gray[200], borderRadius: "5px", overflow: "hidden" }}>
                          <div style={{ width: `${Math.min((project.raised / project.target) * 100, 100)}%`, height: "100%", backgroundColor: colors.primary[500], borderRadius: "5px" }} />
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/donate/${project.id}`)}
                        style={{
                          width: "100%", padding: "16px", backgroundColor: colors.text.primary, color: "white",
                          border: "none", borderRadius: "14px", fontWeight: "700", fontSize: "1.1rem", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.02)";
                          e.target.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                        }}
                      >
                        Donate Now <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default DonationDashboard;
