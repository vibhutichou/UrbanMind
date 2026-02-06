import React, { useState } from "react";
import { createDonation, verifyPayment } from "../services/donationService";
import { useAuth } from "../context/AuthContext";

const DonatePage = ({ problem }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");

  const handleDonate = async () => {
    // 1️⃣ Create donation + Razorpay order
    const res = await createDonation({
      problemId: problem.id,
      donorUserId: user.id,
      receiverUserId: problem.assignedNgoId,
      amount: amount,
      paymentGateway: "RAZORPAY",
    });

    const donation = res.data.data;

    // 2️⃣ Open Razorpay popup
    const options = {
      key: "rzp_test_xxxxxxxxxx", // your test key
      amount: donation.amount * 100,
      currency: "INR",
      name: "UrbanMind",
      description: "Donation Payment",
      order_id: donation.gatewayOrderId,

      handler: async function (response) {
        // 3️⃣ Verify payment in backend
        await verifyPayment(donation.id, {
          gatewayPaymentId: response.razorpay_payment_id,
          gatewaySignature: response.razorpay_signature,
          paymentMethod: "UPI",
        });

        alert("✅ Payment Successful!");
      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <h2>Donate for Problem #{problem.id}</h2>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleDonate}>Pay Now</button>
    </div>
  );
};

export default DonatePage;
