import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constant.js";
import { useSelector } from "react-redux";

const plans = [
  {
    name: "DevLite",
    price: "₹199/mo",
    key: "devlite",
    img: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=60",
    features: ["5 Daily Swipes", "Basic Match Filters", "View Profiles", "Send 3 Requests/Day"],
  },
  {
    name: "DevPro",
    price: "₹399/mo",
    key: "devpro",
    img: "https://images.unsplash.com/photo-1581091012184-5c7b6e7f6e2b?auto=format&fit=crop&w=800&q=60",
    features: ["Unlimited Swipes", "Priority Match Queue", "Advanced Skill Filtering", "Instant Profile Boost (1/day)"],
  },
  {
    name: "HyperNova",
    price: "₹699/mo",
    key: "hypernova",
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
    features: [
      "Unlimited Everything",
      "AI Match Suggestions (Gemini)",
      "Profile Spotlight (24 hrs)",
      "Exclusive Verified Badge",
      "View Who Viewed You",
    ],
  },
];

const handleActivate = async (type) => {
  try {
    const res = await axios.post(
      BASE_URL + "/payment/create",
      { membershipType: type },
      { withCredentials: true }
    );

    const { amount, orderId, keyId, currency, notes } = res.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "Dev-Verse",
      description: "Membership Activation",
      order_id: orderId,
      prefill: {
        name: `${notes.firstName || ""} ${notes.lastName || ""}`.trim(),
        email: notes.emailId || "",
        contact: "9999999999",
      },
      theme: {
        color: "#00ff8f",
        backdrop_color: "#03170e",
        hide_topbar: false,
      },
      handler: async function (response) {
        try {
          await axios.post(
            BASE_URL + "/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { withCredentials: true }
          );

          window.location.reload();
        } catch (err) {
          console.error("verification error:", err);
          alert("Payment verification failed. Contact support.");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error(error);
    alert("Could not create order. Try again.");
  }
};

const Premium = () => {
  const user = useSelector((store) => store.user);
  const userPlanKey = user?.membershipType ? user.membershipType.toLowerCase() : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#03170e] to-black text-white pt-24 px-6 flex flex-col items-center">

      <h1 className="text-5xl font-mono font-bold text-green-400 drop-shadow-[0_0_12px_#00ff8f] mb-3">
        Upgrade Your DevVerse Power
      </h1>

      <p className="text-gray-300 mb-6 tracking-wide font-mono">Choose a plan and unlock next-level matchmaking ⚡</p>

      {user?.isPremium && (
        <p className="text-green-400 mb-6 font-mono text-lg">
          You already have an active <span className="font-bold">{user.membershipType?.toUpperCase()}</span> membership 🎉
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        {plans.map((plan, index) => {
          const isCurrent = userPlanKey === plan.key;

          return (
            <div
              key={index}
              className="
                w-80 bg-[#0f1416]/80 border border-green-400/40 rounded-2xl 
                shadow-[0_0_20px_#00ff8f40] backdrop-blur-xl p-6 relative
                transition-all duration-300 ease-out
                hover:scale-[1.03] 
                hover:shadow-[0_0_40px_#00ff8fa0]
                hover:border-green-400/70
              "
            >
              <figure className="w-full h-40 rounded-xl overflow-hidden mb-4 shadow-[0_0_12px_#00ff8f50]">
                <img src={plan.img} alt={plan.name} className="w-full h-full object-cover" />
              </figure>

              <h2 className="text-3xl font-bold text-green-300 drop-shadow-[0_0_10px_#00ff8f] font-mono flex items-center justify-between">
                {plan.name}
                {isCurrent && (
                  <span className="ml-2 text-xs bg-green-400 text-black px-2 py-1 rounded font-mono">
                    CURRENT PLAN
                  </span>
                )}
              </h2>

              <p className="text-xl text-green-200 mt-1 mb-4 font-semibold">{plan.price}</p>

              <ul className="space-y-2 text-gray-200 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i}>✔ {feature}</li>
                ))}
              </ul>

              <button
                disabled={isCurrent}
                onClick={() => handleActivate(plan.name)}
                className={`mt-6 w-full py-2 rounded-lg font-bold transition-all ${
                  isCurrent
                    ? "bg-gray-600 cursor-not-allowed text-gray-300"
                    : "bg-green-400 text-black shadow-[0_0_15px_#00ff8f80] hover:bg-green-300"
                }`}
              >
                {isCurrent ? "Current Plan" : "Activate"}
              </button>
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Premium;
