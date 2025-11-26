import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      if (feed && feed.length > 0) return;
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

// ⭐ STARFIELD BACKGROUND (Black + Neon Green)
useEffect(() => {
  const timeout = setTimeout(() => {
    const canvas = document.getElementById("starfield");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 160;
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

  if (!feed) return null;

  if (feed.length === 0)
    return (
      <h1 className="text-white text-center mt-10 text-2xl">
        You have reached the end
      </h1>
    );

  return (
    <div className="relative min-h-screen w-full flex justify-center items-center overflow-hidden">

      {/* ⭐ STARFIELD BACKGROUND */}
      <canvas
        id="starfield"
        className="absolute inset-0 w-full h-full z-0"
      ></canvas>

      {/* MAIN FEED CONTENT */}
      <div className="z-10 flex justify-center my-10">
        {feed && Array.isArray(feed) && feed.length > 0 ? (
          <UserCard user={feed[0]} />
        ) : (
          <p className="text-gray-400 text-center">Loading feed...</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
