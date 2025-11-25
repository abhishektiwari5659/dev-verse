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

    const interval = setInterval(draw, 45);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ----------------------------------------------------------------
    INTERACTIVE PARTICLE NETWORK 2.0
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
        this.vx = (Math.random() - 0.5) * 0.5; // Slower speed
        this.vy = (Math.random() - 0.5) * 0.5; // Slower speed
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
      // **IMPORTANT:** Use e.clientX/Y as canvas is full screen
      cursor.x = e.clientX; 
      cursor.y = e.clientY;
    };

    const handleClick = (e) => {
      // CLICK → spawn node
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

        // CURSOR → attract nearby nodes
        if (cursor.x != null) {
          let dx = cursor.x - particles[i].x;
          let dy = cursor.y - particles[i].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < attractionRadius) {
            particles[i].x += dx * 0.01;
            particles[i].y += dy * 0.01;
          }

          // OPTIONAL: draw a line from cursor → particle
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

    animate(); // Start the animation loop

    // Proper cleanup function
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

      {/* Matrix - Z-index: 0 (furthest back) */}
      <canvas
        id="matrix-signup"
        className="fixed inset-0 z-0 opacity-[0.3]"
      ></canvas>

      {/* Particle Network - Z-index: 1 (captures events) */}
      <canvas
        id="particle-canvas"
        className="fixed inset-0 z-1 opacity-[0.5]" // <-- FIXED: Changed z-0 to z-1
      ></canvas>

      {/* SIGNUP CARD - Z-index: 10 (foreground) */}
      <div className="relative z-10 w-full max-w-md bg-gray-900/40 backdrop-blur-xl
             border border-green-400/20 rounded-2xl shadow-[0_0_25px_rgba(0,255,140,0.1)]
             p-8 animate-fadeIn">

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

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="input input-bordered w-full bg-gray-800/70 border-gray-600 text-white
              focus:ring-2 focus:ring-green-400 px-4 py-3 rounded-xl placeholder-gray-400"
          />

          <input
            name="photoUrl"
            type="text"
            placeholder="Profile Photo URL (Optional)"
            value={form.photoUrl}
            onChange={handleChange}
            className="input input-bordered w-full bg-gray-800/70 border-gray-600 text-white
              focus:ring-2 focus:ring-green-400 px-4 py-3 rounded-xl placeholder-gray-400"
          />

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