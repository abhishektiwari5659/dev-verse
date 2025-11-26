import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

/* ------------------ AI BIO (Backend) ------------------ */
const generateBio = async (skills) => {
  try {
    const res = await axios.post(
      BASE_URL + "/ai/generate-bio",
      { skills },
      { withCredentials: true }
    );

    return res.data.bio || "Developer passionate about building modern apps.";
  } catch (err) {
    console.error("AI Bio Error:", err);
    return "Developer passionate about building modern apps.";
  }
};

/* ------------------ AI SKILL SUGGESTIONS ------------------ */
const suggestSkills = async (skills) => {
  try {
    const res = await axios.post(
      BASE_URL + "/ai/suggest-skills",
      { skills },
      { withCredentials: true }
    );

    return res.data.suggestions || [];
  } catch (err) {
    console.error("AI Skill Suggestion Error:", err);
    return [];
  }
};
/* ------------------------------------------------------- */

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [about, setAbout] = useState(user?.about || "");
  const [skills, setSkills] = useState(user?.skills?.join(", ") || "");
  const [showToast, setShowToast] = useState(false);

  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingSkillAI, setLoadingSkillAI] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState([]);

  const dispatch = useDispatch();

  /* =====================================================
      PROFILE COMPLETION METER
  ===================================================== */
  const calculateCompletion = () => {
    let filled = 0;
    let total = 6;
    if (firstName.trim()) filled++;
    if (lastName.trim()) filled++;
    if (age) filled++;
    if (gender) filled++;
    if (skills.trim()) filled++;
    if (about.trim()) filled++;
    return Math.round((filled / total) * 100);
  };

  const completion = calculateCompletion();

  /* =====================================================
      GRID BACKGROUND
  ===================================================== */
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

  /* =====================================================
      MATRIX BACKGROUND
  ===================================================== */
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

  /* =====================================================
      SAVE PROFILE
  ===================================================== */
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

  /* =====================================================
      AI BIO GENERATION
  ===================================================== */
  const handleGenerateBio = async () => {
    if (loadingAI) return; // prevent double click
    setLoadingAI(true);

    const bio = await generateBio(skills);
    setAbout(bio);

    setLoadingAI(false);
  };

  /* =====================================================
      AI SKILL SUGGESTION
  ===================================================== */
  const handleSuggestSkills = async () => {
    if (!skills.trim() || loadingSkillAI) return;

    setLoadingSkillAI(true);
    const suggestions = await suggestSkills(skills);
    setSkillSuggestions(suggestions);
    setLoadingSkillAI(false);
  };

  /* =====================================================
      RENDER
  ===================================================== */
  return (
    <div className="relative min-h-screen text-white px-6 py-10 flex justify-center items-center overflow-hidden">

      {/* Backgrounds */}
      <canvas id="edit-grid-bg" className="fixed inset-0 z-0 opacity-30"></canvas>
      <canvas id="edit-matrix-bg" className="fixed inset-0 z-0 opacity-20"></canvas>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl relative z-10">

        {/* LEFT: FORM */}
        <div className="bg-black/50 border border-green-400/30 rounded-2xl shadow-[0_0_25px_#00ff8f30] backdrop-blur-xl p-10">

          <div className="text-center mb-10">
            <h2 className="text-5xl font-extrabold tracking-wide text-green-400 drop-shadow-[0_0_10px_#00ff8f]">
              EDIT PROFILE
            </h2>
          </div>

          {/* PROGRESS BAR */}
          <div className="mb-8">
            <p className="font-mono text-green-300 mb-1">
              Profile Completion: {completion}%
            </p>

            <div className="w-full h-4 bg-black border border-green-400/30 rounded-lg overflow-hidden">
              <div
                className="h-full bg-green-400 transition-all shadow-[0_0_12px_#00ff8f]"
                style={{ width: `${completion}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={saveProfile} className="space-y-6">

            {/* BASIC FIELDS */}
            {[
              { label: "First Name", value: firstName, setter: setFirstName },
              { label: "Last Name", value: lastName, setter: setLastName },
              { label: "Photo URL", value: photoUrl, setter: setPhotoUrl },
            ].map((item, index) => (
              <div key={index}>
                <label className="block text-green-300 font-mono mb-2">
                  {item.label}
                </label>
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => item.setter(e.target.value)}
                  className="w-full rounded-xl border border-green-400/30 bg-black/40 text-white px-4 py-3"
                />
              </div>
            ))}

            {/* AGE + GENDER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-green-300 font-mono mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full rounded-xl border border-green-400/30 bg-black/40 text-white px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-green-300 font-mono mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-xl border border-green-400/30 bg-black/40 text-white px-4 py-3"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* ABOUT + AI BUTTON */}
            <div>
              <label className="block text-green-300 font-mono mb-2">About</label>

              <button
                type="button"
                onClick={handleGenerateBio}
                disabled={loadingAI}
                className={`px-4 py-2 mb-3 text-sm rounded-lg font-semibold shadow-[0_0_10px_#00ff8f80]
                  ${loadingAI ? "bg-gray-600 text-gray-300" : "bg-green-500 text-black hover:bg-green-400"}`}
              >
                {loadingAI ? "Generating..." : "⚡ Generate Smart Bio (AI)"}
              </button>

              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows="3"
                className="w-full rounded-xl border border-green-400/30 bg-black/40 text-white px-4 py-3 resize-none"
              />
            </div>

            {/* SKILLS + AI SUGGESTIONS */}
            <div>
              <label className="block text-green-300 font-mono mb-2">Skills</label>

              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Node, MongoDB"
                className="w-full rounded-xl border border-green-400/30 bg-black/40 text-white px-4 py-3"
              />

              {/* Suggest Button */}
              <button
                type="button"
                onClick={handleSuggestSkills}
                disabled={loadingSkillAI}
                className={`mt-3 px-4 py-2 text-sm rounded-lg font-semibold shadow-[0_0_10px_#00ff8f80]
                  ${loadingSkillAI ? "bg-gray-600 text-gray-300" : "bg-green-500 text-black hover:bg-green-400"}`}
              >
                {loadingSkillAI ? "Suggesting..." : "🔮 Suggest Skills (AI)"}
              </button>

              {/* Suggestions */}
              {skillSuggestions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {skillSuggestions.map((sk, idx) => (
                    <span
                      key={idx}
                      onClick={() => {
                        const current = skills.split(",").map(s => s.trim());
                        if (!current.includes(sk)) {
                          setSkills([...current, sk].join(", "));
                        }
                      }}
                      className="cursor-pointer px-3 py-1 rounded-full text-xs
                        bg-green-400/20 border border-green-400/40 text-green-300
                        hover:bg-green-400 hover:text-black transition"
                    >
                      + {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-green-400 text-black font-bold shadow-[0_0_20px_#00ff8f80] hover:bg-green-300"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="flex justify-center items-start">
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

        {showToast && (
          <div className="toast toast-end z-50">
            <div className="alert alert-success shadow-lg bg-green-600 text-white">
              Profile updated successfully!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
