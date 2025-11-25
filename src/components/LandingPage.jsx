import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "01<>[]{}/\\&$#@!*%|abcdefghijklmnopqrstuvwxyz";
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; // darker for readability
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff8f66"; // softer green
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const loop = setInterval(draw, 45);

    return () => {
      clearInterval(loop);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* MATRIX CANVAS */}
      <canvas id="matrix-canvas" className="fixed inset-0 z-0" />

      {/* LEFT DARK GRADIENT FOR READABILITY */}
      <div className="absolute inset-y-0 left-0 w-full md:w-1/2 bg-gradient-to-r from-black via-black/60 to-transparent z-0 pointer-events-none" />

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* LEFT: HERO AREA WITH GLASS BACKDROP */}
            <div className="space-y-6 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide glow-neon-strong">
                DEVVERSE
              </h1>

              <div className="text-lg md:text-2xl font-medium">
                <span className="typing inline-block pr-2 text-green-300">
                  Find developers who match your vibe...
                </span>
                <span className="text-sm md:text-base inline-block ml-2 opacity-80 text-green-200">
                  Swipe • Match • Build together
                </span>
              </div>

              <p className="mt-4 text-gray-200 max-w-md leading-relaxed">
                A matchmaking hub for devs & tech enthusiasts — collaborate on projects,
                discover teammates, or just find someone to pair-program with.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/app")}
                  className="px-6 py-3 rounded-md border border-green-400 text-green-300 
                  hover:bg-green-400 hover:text-black transition shadow-[0_0_10px_#00ff8f55]"
                >
                  Enter DevVerse
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-3 rounded-md bg-transparent border border-gray-600 
                  text-gray-200 hover:bg-white hover:text-black transition"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-3 rounded-md bg-green-400 text-black 
                  font-semibold hover:opacity-90 transition"
                >
                  Sign up
                </button>
              </div>

              <div className="mt-6 text-xs text-gray-500">
                By continuing you agree to the community guidelines.
              </div>
            </div>

            {/* RIGHT: FUTURISTIC VISUALS */}
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-80 h-80 md:w-96 md:h-96 transform-gpu animate-float">
                <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full border-2 
                  border-green-400/30 bg-black/30 backdrop-blur-md shadow-[0_0_20px_#00ff8f33]" />

                <div className="absolute top-6 left-12 w-28 h-28 rounded-2xl border-2 
                  border-green-300/30 bg-black/20 shadow-[0_0_15px_#00ff8f22]" />

                <div className="absolute bottom-4 right-8 w-36 h-36 rounded-full border-2 
                  border-green-200/30 bg-black/20 shadow-[0_0_20px_#00ff8f22]" />

                <div className="absolute inset-0 m-auto w-44 h-60 md:w-52 md:h-72 rounded-xl 
                  bg-gradient-to-t from-[#003300]/60 to-[#005500]/20 border border-green-400/30 
                  flex flex-col items-center justify-center shadow-[0_0_30px_#00ff8f44]">
                  <div className="w-16 h-16 rounded-full border-2 border-green-300/80 
                    mb-4 flex items-center justify-center text-green-200 shadow-[0_0_20px_#00ff8f88]">
                    DV
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-semibold text-green-200">
                      Dev Matches
                    </div>
                    <div className="text-xs text-green-100 opacity-90">
                      Swipe · Pair · Build
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TERMINAL SECTION: HOW IT WORKS */}
        <section className="px-6 pb-10">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <span className="terminal-title">devverse.sh — How it works</span>
              </div>
              <div className="terminal-body">
                <p className="terminal-line">
                  <span className="prompt">$</span> devverse init <span className="arg">--profile</span>
                </p>
                <p className="terminal-line-muted">
                  ▸ Create your dev card: stack, interests, vibe.
                </p>

                <p className="terminal-line mt-3">
                  <span className="prompt">$</span> devverse match <span className="arg">--collab</span>
                </p>
                <p className="terminal-line-muted">
                  ▸ Get swipe-style matches with people who build like you do.
                </p>

                <p className="terminal-line mt-3">
                  <span className="prompt">$</span> devverse connect <span className="arg">--ship-it</span>
                </p>
                <p className="terminal-line-muted">
                  ▸ Chat, share repos, spin up ideas, ship projects together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES + TAGS SECTION */}
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* WHY DEVVERSE */}
            <div className="terminal-window md:col-span-2">
              <div className="terminal-header">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <span className="terminal-title">logs/devverse.log</span>
              </div>
              <div className="terminal-body">
                <p className="terminal-line-muted">
                  [info] Matching devs based on interests, stack & timezone.
                </p>
                <p className="terminal-line-muted">
                  [info] No recruiters. No noise. Just builders.
                </p>
                <p className="terminal-line-muted">
                  [info] Designed for hackathons, side projects & long-term collabs.
                </p>
                <p className="terminal-line-muted">
                  [ok] You bring the ideas. DevVerse brings the people.
                </p>

                <ul className="mt-4 list-disc list-inside text-xs md:text-sm text-green-200/90 space-y-1">
                  <li>Swipe-style experience, tuned for devs not dating.</li>
                  <li>Highlight your GitHub, stack, tools & availability.</li>
                  <li>Discover devs who code at your level & in your niche.</li>
                </ul>
              </div>
            </div>

            {/* BUILT FOR WHO */}
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <span className="terminal-title">who_is_this_for?</span>
              </div>
              <div className="terminal-body space-y-2">
                <div className="tag-grid">
                  <span className="tag-pill">Full-stack devs</span>
                  <span className="tag-pill">Backend nerds</span>
                  <span className="tag-pill">Frontend artists</span>
                  <span className="tag-pill">AI / ML explorers</span>
                  <span className="tag-pill">Students & learners</span>
                  <span className="tag-pill">Indie hackers</span>
                  <span className="tag-pill">Open-source fans</span>
                  <span className="tag-pill">Hackathon hunters</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAKE LIVE ACTIVITY / FOOTER TERMINAL */}
        <section className="px-6 pb-10">
          <div className="max-w-5xl mx-auto">
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <span className="terminal-title">live/activity</span>
              </div>
              <div className="terminal-body text-xs md:text-sm">
                <p className="terminal-line-muted">
                  [match] React dev from Bangalore liked a Rust systems dev.
                </p>
                <p className="terminal-line-muted">
                  [collab] New side project started: &quot;Realtime Code Review Bot&quot;.
                </p>
                <p className="terminal-line-muted">
                  [ship] Two strangers just shipped their first SaaS together.
                </p>
                <p className="terminal-line-muted">
                  [you?] Your dev match log is still empty. Time to change that.
                </p>

                <button
                  onClick={() => navigate("/signup")}
                  className="mt-4 inline-flex px-4 py-2 rounded-md border border-green-400/70 
                  text-green-200 hover:bg-green-400 hover:text-black transition text-xs md:text-sm"
                >
                  $ devverse signup --now
                </button>
              </div>
            </div>

            <p className="mt-4 text-[10px] md:text-xs text-gray-500 text-center">
              DevVerse • Built for people who prefer terminal themes over small talk.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
