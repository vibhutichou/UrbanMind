import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResponsiveLayout from "../Common/ResponsiveLayout";
import { ArrowLeft, Save, DollarSign, Users, Calendar, MapPin, CheckCircle, TrendingUp } from "lucide-react";
import { colors } from "../../styles/colors";
import axios from "axios";
import { markProblemForDonation, getDonationsByProblemId } from "../../services/donationService";

const NGOProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Donation State
  const [donationRequired, setDonationRequired] = useState(false);
  const [targetAmount, setTargetAmount] = useState("");
  const [donations, setDonations] = useState([]);
  const [totalRaised, setTotalRaised] = useState(0);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8086/api/v1";

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Project Details
        // Assuming the endpoint is /problems/{id} based on the mark-donation endpoint structure
        const projectRes = await axios.get(`${API_BASE_URL}/problems/${id}`);
        const projectData = projectRes.data.data || projectRes.data; // Handle potentially different wrapper

        setProject(projectData);
        setDonationRequired(projectData.donationRequired || false);
        setTargetAmount(projectData.requiredAmount || projectData.targetAmount || ""); // API uses requiredAmount
        
        // 2. Fetch Donation History (if donation is enabled or to check history)
        if (projectData.donationRequired) {
            fetchDonations(id);
        }

      } catch (err) {
        console.error("Error fetching project details:", err);
        // Fallback for demo if API fails
        // setProject(MOCK_PROJECT); 
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const fetchDonations = async (problemId) => {
      try {
          const res = await getDonationsByProblemId(problemId);
          if (res.data.success) {
              const donationList = res.data.data;
              setDonations(donationList);
              
              // Calculate total raised explicitly from donations if needed, 
              // or use the server provided raised amount if accurate.
              // For now, let's sum up PAID or CREATED (depending on business logic, usually PAID)
              // The mock response showed status "CREATED".
              const calculatedRaised = donationList.reduce((sum, d) => sum + (d.amount || 0), 0);
              setTotalRaised(calculatedRaised);
          }
      } catch (err) {
          console.error("Error fetching donations:", err);
      }
  };

  const handleSave = async () => {
    try {
      // Use the specific endpoint for marking donation
      const payload = {
        donationRequired: donationRequired,
        requiredAmount: Number(targetAmount)
      };

      const res = await markProblemForDonation(id, payload);

      if (res.data.success) {
           const updatedProject = { ...project, ...res.data.data };
           setProject(updatedProject);
           
           // If enabled, fetch donations to show the empty list or existing ones
           if (donationRequired) {
               fetchDonations(id);
           }
           
           setIsEditing(false);
           alert("Project updated successfully! " + (donationRequired ? "Donations are now ENABLED." : "Donations disabled."));
      } else {
        alert("Failed to update: " + res.data.message);
      }

    } catch (err) {
      console.error("Failed to update project", err);
      alert("Error updating project settings.");
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!project) return <div style={{ padding: "2rem" }}>Project not found</div>;

  return (
    <ResponsiveLayout showRightSidebar={false}>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: "none", border: "none", cursor: "pointer", 
            display: "flex", alignItems: "center", gap: "5px", color: colors.text.secondary, marginBottom: "20px"
          }}
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div style={{ 
          backgroundColor: "#fff", padding: "25px", borderRadius: "16px", 
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
        }}>
          <span style={{ 
            backgroundColor: colors.primary[50], color: colors.primary[600], 
            padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600" 
          }}>
            {project.category || "General"}
          </span>
          
          <h1 style={{ marginTop: "15px", marginBottom: "10px", color: colors.text.primary }}>
            {project.title}
          </h1>
          
          <div style={{ display: "flex", gap: "15px", color: colors.text.secondary, marginBottom: "20px", fontSize: "0.9rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><MapPin size={16}/> {project.location || "Unknown Location"}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Calendar size={16}/> Status: {project.status}</span>
          </div>

          <p style={{ lineHeight: "1.6", color: colors.text.secondary, marginBottom: "30px" }}>
            {project.description}
          </p>

          <hr style={{ border: "none", borderTop: `1px solid ${colors.border.light}`, marginBottom: "30px" }} />

          {/* Donation Settings Section */}
          <div style={{ 
            backgroundColor: donationRequired ? colors.success + "10" : colors.gray[50], 
            padding: "20px", borderRadius: "12px", border: `1px solid ${donationRequired ? colors.success : colors.border.light}`
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                <DollarSign size={24} color={donationRequired ? colors.success : colors.text.secondary} />
                Donation Settings
              </h3>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "600" }}>
                Accept Donations
                <input 
                  type="checkbox" 
                  checked={donationRequired} 
                  onChange={(e) => {
                    setDonationRequired(e.target.checked);
                    setIsEditing(true);
                  }}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
              </label>
            </div>

            {donationRequired && (
              <div style={{ marginTop: "20px", animation: "fadeIn 0.3s" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: colors.text.primary }}>
                  Target Amount (₹)
                </label>
                <input 
                  type="number" 
                  value={targetAmount}
                  onChange={(e) => {
                    setTargetAmount(e.target.value);
                    setIsEditing(true);
                  }}
                  placeholder="Enter annual or project budget"
                  style={{ 
                    width: "100%", padding: "12px", borderRadius: "8px", 
                    border: `1px solid ${colors.border.light}`, fontSize: "1rem" 
                  }}
                />
                <p style={{ fontSize: "0.85rem", color: colors.text.secondary, marginTop: "8px" }}>
                  This creates a public donation campaign visible to all Citizens and Volunteers.
                </p>

                {/* --- Live Stats --- */}
                 <div style={{ 
                     marginTop: "20px", padding: "15px", backgroundColor: "#fff", 
                     borderRadius: "10px", border: `1px solid ${colors.border.light}`,
                     display: "flex", alignItems: "center", gap: "20px"
                 }}>
                     <div>
                         <p style={{ margin: 0, fontSize: "0.85rem", color: colors.text.secondary }}>Total Raised</p>
                         <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold", color: colors.primary[600] }}>
                             ₹{totalRaised.toLocaleString()}
                         </p>
                     </div>
                     <div style={{ height: "30px", width: "1px", backgroundColor: colors.border.light }}></div>
                     <div>
                         <p style={{ margin: 0, fontSize: "0.85rem", color: colors.text.secondary }}>Target</p>
                         <p style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold" }}>
                             ₹{Number(targetAmount).toLocaleString()}
                         </p>
                     </div>
                     <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px", color: colors.text.secondary }}>
                        <Users size={16} /> {donations.length} Donors
                     </div>
                 </div>

              </div>
            )}

            {isEditing && (
              <button 
                onClick={handleSave}
                style={{ 
                  marginTop: "20px", width: "100%", padding: "12px", 
                  backgroundColor: colors.primary[500], color: "white", 
                  border: "none", borderRadius: "8px", fontWeight: "700", 
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
                }}
              >
                <Save size={18} /> Save Changes
              </button>
            )}

            {/* --- Donation History Table --- */}
             {donationRequired && donations.length > 0 && (
                <div style={{ marginTop: "30px" }}>
                    <h4 style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <TrendingUp size={18} /> Recent Contributions
                    </h4>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                            <thead>
                                <tr style={{ backgroundColor: colors.gray[100], textAlign: "left" }}>
                                    <th style={{ padding: "10px", borderRadius: "6px 0 0 6px" }}>Donor</th>
                                    <th style={{ padding: "10px" }}>Amount</th>
                                    <th style={{ padding: "10px" }}>Date</th>
                                    <th style={{ padding: "10px", borderRadius: "0 6px 6px 0" }}>Withdrawn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map(d => (
                                    <tr key={d.id} style={{ borderBottom: `1px solid ${colors.border.light}` }}>
                                        <td style={{ padding: "10px" }}>User #{d.donorUserId}</td>
                                        <td style={{ padding: "10px", fontWeight: "600", color: colors.success }}>₹{d.amount}</td>
                                        <td style={{ padding: "10px", color: colors.text.secondary }}>
                                            {new Date(d.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: "10px" }}>
                                            {d.paidAt ? <CheckCircle size={14} color={colors.success}/> : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default NGOProjectDetails;
