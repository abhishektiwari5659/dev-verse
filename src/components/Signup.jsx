import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    photoUrl: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ---------- INTERACTIVE BACKGROUND ---------
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const colors = [
    "rgba(0,150,255,0.35)",   // Neon Blue
    "rgba(255,0,150,0.35)",   // Pink
    "rgba(170,0,255,0.35)",   // Purple
    "rgba(0,255,180,0.35)",   // Cyan
    "rgba(255,140,0,0.35)",   // Orange
  ];

  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const move = (e) => setCursorPos({ x: e.clientX, y: e.clientY });

    const click = () => {
      setColorIndex((prev) => (prev + 1) % colors.length);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("click", click);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", click);
    };
  }, []);

  const glowColor = colors[colorIndex];
  // --------------------------------------------

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await axios.post(BASE_URL + "/signup", form, { withCredentials: true });

      setSuccessMsg("Account created successfully! 🎉 Redirecting...");

      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setErrorMsg(err.response?.data || "Signup failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ---------- Animated Background ---------- */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: `
            radial-gradient(
              circle at ${cursorPos.x}px ${cursorPos.y}px,
              ${glowColor},
              rgba(0,0,0,0.9) 60%
            )
          `,
        }}
      ></div>
      {/* ----------------------------------------- */}

      <div className="relative w-full max-w-md bg-gray-800/60 backdrop-blur-xl border border-gray-700/60 shadow-2xl p-8 rounded-2xl animate-fadeIn">

        <h1 className="text-center text-white text-4xl font-extrabold mb-2 tracking-wide">
          Create Account
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Join <span className="text-blue-400 font-semibold">DevVerse</span> and start matching!
        </p>

        <form onSubmit={handleSignup} className="space-y-5">

          {/* First Name */}
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-gray-700 border-gray-600 text-white 
              focus:ring-2 focus:ring-blue-500 px-4 py-3 rounded-xl placeholder-gray-400"
          />

          {/* Last Name */}
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-700 border-gray-600 text-white 
              focus:ring-2 focus:ring-blue-500 px-4 py-3 rounded-xl placeholder-gray-400"
          />

          {/* Email */}
          <input
            name="emailId"
            type="email"
            placeholder="Email Address"
            value={form.emailId}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-gray-700 border-gray-600 text-white 
              focus:ring-2 focus:ring-blue-500 px-4 py-3 rounded-xl placeholder-gray-400"
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-gray-700 border-gray-600 text-white 
              focus:ring-2 focus:ring-blue-500 px-4 py-3 rounded-xl placeholder-gray-400"
          />

          {/* Photo URL */}
          <input
            name="photoUrl"
            type="text"
            placeholder="Profile Photo URL (Optional)"
            value={form.photoUrl}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-700 border-gray-600 text-white 
              focus:ring-2 focus:ring-blue-500 px-4 py-3 rounded-xl placeholder-gray-400"
          />

          {/* Error */}
          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          {/* Success */}
          {successMsg && (
            <p className="text-green-400 text-sm text-center">{successMsg}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 
              transition-all text-white font-semibold shadow-md
              hover:scale-[1.02]"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-400 font-medium hover:underline ml-1"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
