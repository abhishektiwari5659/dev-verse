import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [about, setAbout] = useState(user?.about || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  // 🔥 CYBER GRID BACKGROUND (Lightweight)
  useEffect(() => {
    const canvas = document.getElementById("edit-grid-bg");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(0,255,140,0.08)";
      ctx.lineWidth = 1;

      const gap = 40;

      for (let x = 0; x < canvas.width; x += gap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  // 🔥 MATRIX STREAM BACKGROUND (Subtle & non-laggy)
  useEffect(() => {
    const canvas = document.getElementById("edit-matrix-bg");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const chars = "01<>[]{}/\\&#$%@!*+=";
    const fontSize = 14;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0,255,140,0.35)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
          drops[i] = 0;

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 60);
    return () => clearInterval(interval);
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, about, age, gender, skills, photoUrl },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <div className="relative min-h-screen text-white px-6 py-10 flex justify-center items-center overflow-hidden">

      {/* BACKGROUNDS */}
      <canvas id="edit-grid-bg" className="fixed inset-0 z-0 opacity-30"></canvas>
      <canvas id="edit-matrix-bg" className="fixed inset-0 z-0 opacity-20"></canvas>

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl relative z-10">

        {/* FORM PANEL */}
        <div className="bg-black/50 border border-green-400/30 rounded-2xl shadow-[0_0_25px_#00ff8f30] backdrop-blur-xl p-10">

          {/* HOLO HEADER */}
          <div className="text-center mb-10">
            <h2 className="text-5xl font-extrabold tracking-wide text-green-400 drop-shadow-[0_0_10px_#00ff8f]">
              EDIT PROFILE
            </h2>

            <div className="mt-3 w-40 mx-auto h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>

            <p className="text-gray-400 mt-3 font-mono text-sm">
              Fine-tune your DevVerse identity.
            </p>
          </div>

          <form onSubmit={saveProfile} className="space-y-6">

            {/* INPUT FIELD TEMPLATE */}
            {[
              { label: "First Name", value: firstName, setter: setFirstName },
              { label: "Last Name", value: lastName, setter: setLastName },
              { label: "Photo URL", value: photoUrl, setter: setPhotoUrl },
            ].map((item, i) => (
              <div key={i}>
                <label className="block text-green-300 font-mono mb-2">
                  {item.label}
                </label>
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => item.setter(e.target.value)}
                  className="w-full rounded-xl border border-green-400/30 bg-black/40 text-white px-4 py-3
                    focus:outline-none focus:ring-2 focus:ring-green-400 transition-all placeholder-gray-500"
                  placeholder={`Enter ${item.label.toLowerCase()}`}
                />
              </div>
            ))}

            {/* AGE + GENDER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-green-300 font-mono mb-2 block">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-xl border border-green-400/30 bg-black/40 text-white px-4 py-3 focus:ring-2 focus:ring-green-400 placeholder-gray-500"
                />
              </div>

              <div>
                <label className="text-green-300 font-mono mb-2 block">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-xl border border-green-400/30 bg-black/40 text-white px-4 py-3 focus:ring-2 focus:ring-green-400"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* ABOUT */}
            <div>
              <label className="text-green-300 font-mono mb-2 block">About</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows="3"
                className="w-full rounded-xl border border-green-400/30 bg-black/40 text-white px-4 py-3 resize-none focus:ring-2 focus:ring-green-400 placeholder-gray-500"
                placeholder="Short bio..."
                maxLength="250"
              />
            </div>

            {/* SKILLS */}
            <div>
              <label className="text-green-300 font-mono mb-2 block">Skills</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Node.js, MongoDB"
                className="w-full rounded-xl border border-green-400/30 bg-black/40 text-white px-4 py-3 focus:ring-2 focus:ring-green-400 placeholder-gray-500"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-green-400 text-black font-semibold 
                shadow-[0_0_20px_#00ff8f80] hover:shadow-[0_0_30px_#00ff8f] hover:bg-green-300 transition-all hover:scale-[1.02]"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* LIVE PREVIEW PANEL */}
        <div className="flex justify-center items-start mt-8 lg:mt-0">
          <UserCard
            user={{
              firstName,
              lastName,
              about,
              age,
              gender,
              skills: skills.split(",").map((s) => s.trim()),
              photoUrl,
            }}
          />
        </div>

        {/* TOAST */}
        {showToast && (
          <div className="toast toast-end">
            <div className="alert alert-success shadow-lg bg-green-600 border-none text-white font-semibold">
              Profile updated successfully!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
