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

  /* ----------------------------------------------------------------
    MATRIX BACKGROUND CANVAS
  ---------------------------------------------------------------- */
  useEffect(() => {
    const canvas = document.getElementById("matrix-signup");
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

    const intervalId = setInterval(draw, 45);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ----------------------------------------------------------------
    INTERACTIVE PARTICLE NETWORK
  ---------------------------------------------------------------- */
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

    // spawn initial particles
    for (let i = 0; i < 70; i++) particles.push(new Particle());

    // Cursor tracking
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

        // CURSOR → attract nearby nodes (gentle)
        if (cursor.x != null) {
          let dx = cursor.x - particles[i].x;
          let dy = cursor.y - particles[i].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < attractionRadius) {
            particles[i].x += dx * 0.01;
            particles[i].y += dy * 0.01;
          }

          // Optional line from cursor → particle
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

    // cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  /* ----------------------------------------------------------------
    FORM HANDLERS
  ---------------------------------------------------------------- */
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

  /* ----------------------------------------------------------------
    JSX
  ---------------------------------------------------------------- */
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* Matrix - far back */}
      <canvas
        id="matrix-signup"
        className="fixed inset-0 z-0 opacity-[0.3]"
      ></canvas>

      {/* Particle Network - z-1 ensures it is below the z-20 form */}
      <canvas
        id="particle-canvas"
        className="fixed inset-0 z-1 opacity-[0.5]" 
      ></canvas>

      {/* SIGNUP CARD - foreground */}
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
          {/* First Name */}
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

          {/* Last Name */}
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-800/70 border-gray-600 text-white
              focus:ring-2 focus:ring-green-400 px-4 py-3 rounded-xl placeholder-gray-400"
          />

          {/* Email */}
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

          {/* Password + Eye Toggle (FIXED CLICK PRIORITY) */}
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

            {/* Eye Button - z-[10] ensures button clicks are registered over the input field */}
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300 transition-colors z-[10]"
            >
              {showPassword ? (
                // open eye
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322c1.332-4.02 5.09-7.072 9.464-7.072 4.375 0 8.133 3.052 9.465 7.072.07.21.07.445 0 .656-1.332 4.02-5.09 7.072-9.465 7.072-4.374 0-8.132-3.052-9.464-7.072a1.032 1.032 0 010-.656z" />
                  <circle cx="12" cy="12" r="3" strokeWidth="1.5" stroke="currentColor" />
                </svg>
              ) : (
                // closed eye (slash)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l18 18" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.58 10.59A3 3 0 0113.41 13.41" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.46 12.52A11.94 11.94 0 012 12c1.332-4.02 5.09-7.072 9.464-7.072 2.02 0 3.9.53 5.464 1.44" />
                </svg>
              )}
            </button>
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          {successMsg && (
            <p className="text-green-400 text-sm text-center">{successMsg}</p>
          )}

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
            <Link
              to="/login"
              className="text-green-400 font-medium hover:underline ml-1"
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