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
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* -------------------------------------------------------------
     GLOBAL COOKIE CONFIG
  ------------------------------------------------------------- */
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  /* -------------------------------------------------------------
     ⭐ STARFIELD BACKGROUND (same as Feed + Login)
  ------------------------------------------------------------- */
  useEffect(() => {
    const timeout = setTimeout(() => {
      const canvas = document.getElementById("starfield-signup");
      if (!canvas) return;

      const ctx = canvas.getContext("2d");

      const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener("resize", resize);

      const STAR_COUNT = 120;
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

  /* -------------------------------------------------------------
     FORM HANDLERS
  ------------------------------------------------------------- */
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

  /* -------------------------------------------------------------
     JSX
  ------------------------------------------------------------- */
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* ⭐ STARFIELD BACKGROUND */}
      <canvas
        id="starfield-signup"
        className="fixed inset-0 w-full h-full z-0"
      ></canvas>

      {/* SIGNUP CARD */}
      <div
        className="relative z-20 w-full max-w-md bg-gray-900/40 backdrop-blur-xl
              border border-green-400/20 rounded-2xl shadow-[0_0_25px_rgba(0,255,140,0.1)]
              p-8 animate-fadeIn"
      >
        <div className="absolute -top-1 left-0 w-full h-[2px] bg-gradient-to-r
                      from-transparent via-green-400/60 to-transparent animate-scanline"></div>

        <h1 className="text-center text-white text-4xl font-extrabold mb-2 tracking-wide drop-shadow-[0_0_6px_#00ff8f]">
          Create Account
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Join <span className="text-green-400 font-semibold">DevVerse</span> and start matching!
        </p>

        <form onSubmit={handleSignup} className="space-y-5">
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-gray-800/70 border-gray-600 text-white
              focus:ring-2 focus:ring-green-400 px-4 py-3 rounded-xl placeholder-gray-400"
          />

          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-800/70 border-gray-600 text-white
              focus:ring-2 focus:ring-green-400 px-4 py-3 rounded-xl placeholder-gray-400"
          />

          <input
            name="emailId"
            type="email"
            placeholder="Email Address"
            value={form.emailId}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-gray-800/70 border-gray-600 text-white
              focus:ring-2 focus:ring-green-400 px-4 py-3 rounded-xl placeholder-gray-400"
          />

          {/* Password + Toggle */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="input input-bordered w-full bg-gray-800/70 border-gray-600 text-white
                focus:ring-2 focus:ring-green-400 px-4 py-3 rounded-xl placeholder-gray-400 pr-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors z-[10]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
          {successMsg && <p className="text-green-400 text-sm text-center">{successMsg}</p>}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-green-400 text-black font-semibold
                shadow-[0_0_20px_#00ff8f50] hover:shadow-[0_0_30px_#00ff8f90]
                hover:bg-green-300 transition-all hover:scale-[1.02]"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?
            <Link to="/login" className="text-green-400 font-medium hover:underline ml-1">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
