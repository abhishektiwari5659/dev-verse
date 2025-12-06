import axios from "axios";
import React, { useEffect, useRef } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed); // might be [] initially
  const dispatch = useDispatch();

  const canvasRef = useRef(null);

  // ==================== FETCH FEED =======================
  const getFeed = async () => {
    try {
      // if feed exists and has items, skip
      if (Array.isArray(feed) && feed.length > 0) return;
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  useEffect(() => {
    getFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // ==================== STARFIELD =======================
  useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Resize canvas
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  // Smooth mouse tracking
  const mouse = { x: 0, y: 0, active: false };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener("mouseleave", () => (mouse.active = false));

  const STAR_COUNT = 140;
  const stars = [];

  class Star {
    constructor() {
      this.reset(true);
    }

    reset(first = false) {
      // Depth effect (closer stars = larger, faster)
      this.z = Math.random() * 2 + 1;

      this.x = Math.random() * canvas.width;
      this.y = first ? Math.random() * canvas.height : -10;

      this.size = this.z; // deeper stars look smaller
      this.speed = this.z * 0.4 + 0.2;

      this.twinkleSpeed = Math.random() * 0.02 + 0.01;
      this.twinkleOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
      this.y += this.speed;

      // Respawn at top
      if (this.y > canvas.height + 10) this.reset();

      // Soft twinkle
      this.brightness =
        0.6 + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.25;

      // Mouse repulsion (fast squared distance, no sqrt)
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist2 = dx * dx + dy * dy;

        if (dist2 < 25000) {
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

      const glow = this.brightness * 40;

      ctx.shadowBlur = glow;
      ctx.shadowColor = "rgb(0, 255, 150)";
      ctx.fillStyle = `rgba(0, 255, 150, ${this.brightness})`;

      ctx.fill();
    }
  }

  for (let i = 0; i < STAR_COUNT; i++) stars.push(new Star());

  let frame = 0;

  const animate = () => {
    frame += 0.016;

    // Draw black background
    ctx.fillStyle = "#000";
ctx.fillRect(0, 0, canvas.width, canvas.height);


    // Draw stars
    for (let i = 0; i < STAR_COUNT; i++) {
      stars[i].update(frame);
      stars[i].draw();
    }

    requestAnimationFrame(animate);
  };

  animate();

  return () => {
    window.removeEventListener("resize", resize);
  };
}, []);


  // ==================== RENDER =======================
  // Always render the canvas so starfield can initialize on first load.
  // Show different content in the foreground depending on feed state.

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center overflow-hidden bg-black">
      {/* STARFIELD BACKGROUND - always present */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        aria-hidden="true"
      />

      {/* MAIN FEED CONTENT */}
      <div className="z-10 w-full max-w-4xl px-4 py-10">
        {/* If feed is undefined/null - show nothing (loading), 
            If feed is [] - show friendly message (but still show canvas),
            If feed has items - show first user card (as before) */}
        {feed === undefined || feed === null ? (
          <p className="text-gray-400 text-center">Loading feed...</p>
        ) : Array.isArray(feed) && feed.length === 0 ? (
          <h1 className="text-white text-center mt-10 text-2xl">
            You have reached the end
          </h1>
        ) : Array.isArray(feed) && feed.length > 0 ? (
          <div className="flex justify-center">
            <UserCard user={feed[0]} />
          </div>
        ) : (
          <p className="text-gray-400 text-center">Loading feed...</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
