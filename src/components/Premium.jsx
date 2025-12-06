import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constant.js";
import { useSelector } from "react-redux";
import { CheckCircle, Sparkles, Shield, Zap } from "lucide-react"; 

/* =========================
   PLANS
   ========================= */
const plans = [
  {
    name: "DevLite",
    key: "devlite",
    monthly: 199,
    yearly: 159,
    yearlyTotal: 1908,
    features: ["5 Daily Swipes", "Basic Match Filters", "View Profiles", "Send 3 Requests/Day"],
    icon: Shield,
  },
  {
    name: "DevPro",
    key: "devpro",
    monthly: 399,
    yearly: 329,
    yearlyTotal: 3948,
    features: ["Unlimited Swipes", "Priority Match Queue", "Advanced Skill Filtering", "Instant Profile Boost (1/day)"],
    popular: true,
    icon: Zap,
  },
  {
    name: "HyperNova",
    key: "hypernova",
    monthly: 699,
    yearly: 559,
    yearlyTotal: 6708,
    features: [
      "Unlimited Everything",
      "AI Match Suggestions (Gemini)",
      "Profile Spotlight (24 hrs)",
      "Exclusive Verified Badge",
      "View Who Viewed You",
    ],
    icon: Sparkles,
  },
];

/* =========================
   UPDATED PAYMENT LOGIC
   ========================= */
const handleActivate = async (type, billingMode, price) => {
  try {
    const res = await axios.post(
      BASE_URL + "/payment/create",
      { membershipType: type, billingMode, price },
      { withCredentials: true }
    );

    const { amount, orderId, keyId, currency, notes } = res.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "Dev-Verse",
      description: `Membership Activation (${billingMode})`,
      order_id: orderId,
      prefill: {
        name: `${notes.firstName || ""} ${notes.lastName || ""}`.trim(),
        email: notes.emailId || "",
        contact: "9999999999",
      },
      theme: {
        color: "#00ff8f",
        backdrop_color: "#03170e",
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
          alert("Payment verification failed. Contact support.");
        }
      },
    };

    new window.Razorpay(options).open();
  } catch (err) {
    alert("Could not create order. Try again.");
  }
};

const Premium = () => {
  const user = useSelector((store) => store.user);
  const userPlanKey = user?.membershipType?.toLowerCase() || null;

  const [billingMode, setBillingMode] = useState("monthly");

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 flex flex-col items-center">

      <h1 className="text-5xl font-mono font-bold text-green-400 drop-shadow-[0_0_12px_#00ff8f] mb-3">
        Upgrade Your DevVerse Power
      </h1>
      <p className="text-gray-300 mb-8 tracking-wide font-mono">
        Choose a premium plan and unlock next-level matchmaking ⚡
      </p>

      {user?.isPremium && (
        <p className="text-green-400 mb-6 font-mono text-lg">
          You already have an active{" "}
          <span className="font-bold">{user.membershipType?.toUpperCase()}</span> membership 🎉
        </p>
      )}

      {/* BILLING TOGGLE */}
      <div className="flex items-center bg-[#0f1416] border border-green-500/30 
                      rounded-full px-3 py-2 mb-10 shadow-[0_0_15px_#00ff8f40] font-mono">
        <button
          onClick={() => setBillingMode("monthly")}
          className={`px-4 py-1 rounded-full transition-all ${
            billingMode === "monthly" ? "bg-green-400 text-black" : "text-green-300"
          }`}
        >
          Monthly
        </button>

        <button
          onClick={() => setBillingMode("yearly")}
          className={`px-4 py-1 rounded-full transition-all ${
            billingMode === "yearly" ? "bg-green-400 text-black" : "text-green-300"
          }`}
        >
          Yearly (Save 20%)
        </button>
      </div>

      {/* PLAN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        {plans.map((plan) => {
          const isCurrent = userPlanKey === plan.key;
          const Icon = plan.icon;

          const price =
            billingMode === "monthly" ? plan.monthly : plan.yearlyTotal;

          return (
            <div
              key={plan.key}
              className="w-80 rounded-2xl p-6 relative border border-green-400/40 
                         bg-[#0f1416]/70 backdrop-blur-xl shadow-[0_0_25px_#00ff8f40]
                         transition-all duration-500 hover:scale-[1.05] hover:-rotate-1 
                         hover:shadow-[0_0_50px_#00ff8fa0]"
            >
              {plan.popular && (
                <div className="absolute -top-3 right-3 bg-green-400 text-black px-3 py-1 
                                rounded-full text-xs font-bold shadow-[0_0_10px_#00ff8f]">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-4">
                <Icon className="mx-auto mb-2 text-green-300" size={35} />
                <h2 className="text-3xl font-bold text-green-300 drop-shadow-[0_0_10px_#00ff8f] font-mono">
                  {plan.name}
                </h2>

                {isCurrent && (
                  <span className="inline-block mt-2 text-xs bg-green-400 text-black px-2 py-1 rounded font-mono">
                    CURRENT PLAN
                  </span>
                )}
              </div>

              <div className="bg-black/60 border border-green-400/30 rounded-xl p-4 
                              mb-5 text-center shadow-[0_0_15px_#00ff8f30]">
                {billingMode === "monthly" ? (
                  <p className="text-2xl text-green-200 font-semibold font-mono">
                    ₹{plan.monthly}/mo
                  </p>
                ) : (
                  <>
                    <p className="text-2xl text-green-200 font-semibold font-mono">
                      ₹{plan.yearly}/mo
                    </p>
                    <p className="text-sm text-gray-300 italic mt-1">
                      ₹{plan.yearlyTotal}/year
                    </p>
                  </>
                )}
              </div>

              <ul className="space-y-2 text-gray-200 text-sm mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                disabled={isCurrent}
                onClick={() => handleActivate(plan.name, billingMode, price)}
                className={`w-full py-2 rounded-lg font-bold transition-all font-mono ${
                  isCurrent
                    ? "bg-gray-600 cursor-not-allowed text-gray-300"
                    : "bg-green-400 text-black shadow-[0_0_15px_#00ff8f80] hover:bg-green-300"
                }`}
              >
                {isCurrent ? "Active Plan" : "Activate"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Premium;
