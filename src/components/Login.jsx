import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";

const Login = () => {
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* -----------------------------------------------------
    GLOBAL AXIOS COOKIE CONFIG
  ----------------------------------------------------- */
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  /* -----------------------------------------------------
    ⭐ STARFIELD BACKGROUND (same as feed)
  ----------------------------------------------------- */
  useEffect(() => {
    const timeout = setTimeout(() => {
      const canvas = document.getElementById("starfield-login");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener("resize", resize);

      const STAR_COUNT = 120; // slightly fewer than feed for mobile performance
      const stars = [];
      const cursor = { x: null, y: null };

      canvas.addEventListener("mousemove", (e) => {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
      });

      class Star {
        constructor() {
          this.reset();
        }

        reset() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.baseSize = Math.random() * 1.6 + 0.8;
          this.size = this.baseSize;
          this.speed = Math.random() * 0.3 + 0.1;
          this.twinkle = Math.random() * 0.15;
        }

        update() {
          this.y += this.speed;
          if (this.y > canvas.height) this.reset();

          this.size =
            this.baseSize + Math.sin(Date.now() * this.twinkle) * 0.3;

          if (cursor.x !== null) {
            const dx = this.x - cursor.x;
            const dy = this.y - cursor.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 140) {
              this.x += dx * 0.08;
              this.y += dy * 0.08;
            }
          }
        }

        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = "#00FF8F";
          ctx.shadowBlur = 18;
          ctx.shadowColor = "#00FF8F";
          ctx.fill();
        }
      }

      for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());

      const animate = () => {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach((star) => {
          star.update();
          star.draw();
        });

        requestAnimationFrame(animate);
      };

      animate();

      return () => window.removeEventListener("resize", resize);
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  /* -----------------------------------------------------
    LOGIN SUBMIT
  ----------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      return navigate("/app");
    } catch (error) {
      setError(error?.response?.data || "Login failed.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* ⭐ STARFIELD BACKGROUND */}
      <canvas
        id="starfield-login"
        className="fixed inset-0 w-full h-full z-0"
      ></canvas>

      {/* LOGIN CARD */}
      <div className="relative bg-gray-800/60 backdrop-blur-xl border border-green-400/20 
          shadow-[0_0_25px_#00ff8f30] rounded-2xl w-full max-w-md p-8 animate-fadeIn z-10">

        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-[0_0_6px_#00ff8f]">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-gray-300 font-medium">Email</span>
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full bg-gray-700/70 border-gray-600 
              text-white focus:outline-none focus:ring-2 focus:ring-green-400 p-3 rounded-xl"
              value={emailId}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control w-full relative">
            <label className="label">
              <span className="label-text text-gray-300 font-medium">Password</span>
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="input input-bordered w-full bg-gray-700/70 border-gray-600
              text-white focus:outline-none focus:ring-2 focus:ring-green-400 p-3 rounded-xl pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors z-[10]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-green-400 hover:bg-green-300 text-black font-semibold 
            rounded-xl shadow-[0_0_20px_#00ff8f50] hover:shadow-[0_0_30px_#00ff8f90]
            hover:scale-[1.02] transition-all"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray-400">
            Don’t have an account?
            <Link to="/signup" className="ml-1 text-green-400 hover:underline">
              Sign Up
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;
