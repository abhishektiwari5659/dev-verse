import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

const Login = () => {
  const [emailId, setEmail] = useState("abhi@dev.com");
  const [password, setPassword] = useState("Abhi@123");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---------- INTERACTIVE BACKGROUND ----------
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      return navigate("/");
    } catch (error) {
      setError(error?.response?.data);
      console.error("Login failed:", error);
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

      <div className="relative bg-gray-800/60 backdrop-blur-xl border border-gray-700/60 shadow-2xl rounded-2xl w-full max-w-md p-8 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-gray-300 font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full bg-gray-700 border-gray-600 
              text-white focus:outline-none focus:ring-2 focus:ring-blue-500 p-3 rounded-xl"
              value={emailId}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-gray-300 font-medium">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full bg-gray-700 border-gray-600 
              text-white focus:outline-none focus:ring-2 focus:ring-blue-500 p-3 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold 
            rounded-xl shadow-md hover:scale-[1.02] transition-all"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-400">
            Don’t have an account?
            <Link to="/signup" className="ml-1 text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
