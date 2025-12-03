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
    GLOBAL AXIOS COOKIE CONFIG (LOCAL + PROD)
  ----------------------------------------------------- */
  useEffect(() => {
    axios.defaults.withCredentials = true;  // Needed for Render cookies
  }, []);

  /* -----------------------------------------------------
    MATRIX BACKGROUND (original effect)
  ----------------------------------------------------- */
  useEffect(() => {
    const canvas = document.getElementById("matrix-login");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const chars = "01<>[]{}/\\&#$%@!*+=";
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff8f55";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 45);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* -----------------------------------------------------
    PARTICLE NETWORK EFFECT
  ----------------------------------------------------- */
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    const maxDistance = 140;
    const attractionRadius = 160;

    class Particle {
      constructor(x, y) {
        this.x = x ?? Math.random() * canvas.width;
        this.y = y ?? Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "#00ff8f";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#00ff8f";
        ctx.fill();
      }
    }

    for (let i = 0; i < 70; i++) particles.push(new Particle());

    const cursor = { x: null, y: null };

    const handleMouseMove = (e) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    };

    const handleClick = (e) => {
      particles.push(new Particle(e.clientX, e.clientY));
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.strokeStyle = `rgba(0,255,143,${1 - dist / maxDistance})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        if (cursor.x != null) {
          let dx = cursor.x - particles[i].x;
          let dy = cursor.y - particles[i].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < attractionRadius) {
            particles[i].x += dx * 0.01;
            particles[i].y += dy * 0.01;
          }

          if (dist < maxDistance) {
            ctx.strokeStyle = `rgba(0,255,143,${1 - dist / maxDistance})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cursor.x, cursor.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.stroke();
          }
        }
      }
    };

    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

        connectParticles();
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", resize);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("click", handleClick);
      };
    }, []);

    /* -----------------------------------------------------
      LOGIN SUBMIT HANDLER
    ----------------------------------------------------- */
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      try {
        const res = await axios.post(
          BASE_URL + "/login",
          { emailId, password },
          { withCredentials: true } // Force cookie sending
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

        <canvas id="matrix-login" className="fixed inset-0 z-0 opacity-[0.35]"></canvas>
        <canvas id="particle-canvas" className="fixed inset-0 z-1 opacity-[0.5]"></canvas>

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
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322c1.332-4.02 5.09-7.072 9.464-7.072 4.375 0 8.133 3.052 9.465 7.072.07.21.07.445 0 .656-1.332 4.02-5.09 7.072-9.465 7.072-4.374 0-8.132-3.052-9.464-7.072a1.032 1.032 0 010-.656z" />
                    <circle cx="12" cy="12" r="3" strokeWidth={1.5} stroke="currentColor" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l18 18" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.58 10.59A3 3 0 0113.41 13.41" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.46 12.52A11.94 11.94 0 012 12c1.332-4.02 5.09-7.072 9.464-7.072 2.02 0 3.9.53 5.464 1.44" />
                  </svg>
                )}
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
