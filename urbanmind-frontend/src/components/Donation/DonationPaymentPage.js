import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResponsiveLayout from "../Common/ResponsiveLayout";
import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import { colors } from "../../styles/colors";
import { createDonation, processPayment, getProblemDetails } from "../../services/donationService";
import { useAuth } from "../../context/AuthContext";

const DonationPaymentPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [problem, setProblem] = useState(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card"); 
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await getProblemDetails(projectId);
        setProblem(res.data.data);
      } catch (err) {
        console.error("Failed to fetch problem", err);
        alert("Failed to load project details");
      }
    };
    if(projectId) fetchProblem();
  }, [projectId]);

  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) return alert("Please enter a valid amount");
    if (!problem) return alert("Project details not loaded");
    
    setProcessing(true);
    try {
      // 1. Create Donation Record (Backend generates Razorpay Order)
      const donationData = {
        problemId: Number(projectId),
        donorUserId: user?.id || 1, 
        receiverUserId: problem.assignedToUserId || 1, // Fallback to 1 if not assigned
        amount: Number(amount),
        paymentGateway: "RAZORPAY"
      };
      
      const res = await createDonation(donationData);
      const donation = res.data.data;
      
      // 2. Open Razorpay Checkout
      const options = {
        key: "rzp_test_SA7lEzoBJwQYXk", // Test Key from properties
        amount: donation.amount * 100, // Amount in paise
        currency: "INR",
        name: "UrbanMind",
        description: `Donation for Problem #${projectId}`,
        order_id: donation.gatewayOrderId, 
        handler: async function (response) {
            try {
                // 3. Verify/Complete Payment on Backend
                const paymentPayload = {
                    gatewayPaymentId: response.razorpay_payment_id,
                    gatewaySignature: response.razorpay_signature,
                    paymentMethod: "RAZORPAY"
                };
                
                await processPayment(donation.id, paymentPayload);
                setSuccess(true);
            } catch (err) {
                console.error("Verification failed", err);
                alert("Payment verification failed. Please contact support.");
            }
        },
        theme: {
            color: colors.primary[500],
        },
        modal: {
            ondismiss: function() {
                setProcessing(false);
            }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment initiation failed", err);
      setProcessing(false);
      alert("Payment initiation failed. Please check console.");
    }
  };

  if (success) {
    return (
      <ResponsiveLayout showRightSidebar={false}>
        <div style={{ 
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
          minHeight: "80vh", padding: "20px", textAlign: "center" 
        }}>
           <div style={{ width: "80px", height: "80px", backgroundColor: "#dcfce7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
             <ShieldCheck size={40} color="#16a34a" />
           </div>
           <h1 style={{ color: colors.text.primary, marginBottom: "10px" }}>Thank You!</h1>
           <p style={{ color: colors.text.secondary, maxWidth: "400px", marginBottom: "30px" }}>
             Your donation of ₹{amount} has been successfully processed.
           </p>
           <button 
             onClick={() => navigate('/citizen/donations')}
             style={{ padding: "12px 24px", backgroundColor: colors.primary[500], color: "white", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}
           >
             Return to Dashboard
           </button>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout showRightSidebar={false}>
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: "none", border: "none", cursor: "pointer", 
            display: "flex", alignItems: "center", gap: "5px", color: colors.text.secondary, marginBottom: "20px"
          }}
        >
          <ArrowLeft size={20} /> Cancel
        </button>

        <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <h1 style={{ marginBottom: "20px", fontSize: "1.5rem", color: colors.text.primary }}>Complete Donation</h1>
          
          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: colors.text.secondary }}>Enter Amount (₹)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 1000"
              style={{ 
                width: "100%", padding: "15px", fontSize: "1.5rem", borderRadius: "8px", 
                border: `2px solid ${colors.primary[100]}`, outline: "none", fontWeight: "700", color: colors.primary[600]
              }}
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "15px", fontWeight: "600", color: colors.text.secondary }}>Payment Method</label>
            <div style={{ display: "flex", gap: "15px" }}>
              <div 
                onClick={() => setMethod("card")}
                style={{ 
                  flex: 1, padding: "15px", border: `2px solid ${method === 'card' ? colors.primary[500] : colors.border.light}`, 
                  borderRadius: "12px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
                  backgroundColor: method === 'card' ? colors.primary[50] : "white"
                }}
              >
                <CreditCard size={24} color={method === 'card' ? colors.primary[500] : colors.text.secondary} />
                <span style={{ fontWeight: "600", fontSize: "0.9rem", color: colors.text.primary }}>Razorpay Secure</span>
              </div>
            </div>
          </div>

          <button 
             onClick={handleDonate}
             disabled={processing}
             style={{ 
               width: "100%", padding: "16px", backgroundColor: colors.success, color: "white", 
               border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "1.1rem", 
               cursor: processing ? "wait" : "pointer", opacity: processing ? 0.7 : 1,
               boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)"
             }}
          >
            {processing ? "Processing..." : `Pay ₹${amount || '0'}`}
          </button>
          
          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: colors.text.secondary, fontSize: "0.85rem" }}>
            <ShieldCheck size={16} /> Secure Payment via Razorpay
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default DonationPaymentPage;
