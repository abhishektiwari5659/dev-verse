import axios from "axios";
import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { removeUserFromFeed } from "../utils/feedSlice";

const SWIPE_THRESHOLD = 120;

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  if (!user) return null;

  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    about,
    skills = [],
  } = user;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  // Swipe glows
  const rightGlow = useTransform(x, [0, 150], ["rgba(0,0,0,0)", "rgba(0,255,140,0.25)"]);
  const leftGlow = useTransform(x, [-150, 0], ["rgba(255,0,0,0.25)", "rgba(0,0,0,0)"]);

  const handleSwipe = async (status) => {
    await axios.post(
      BASE_URL + "/request/send/" + status + "/" + _id,
      {},
      { withCredentials: true }
    );
    dispatch(removeUserFromFeed(_id));
  };

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    if (offset > SWIPE_THRESHOLD) handleSwipe("interested");
    else if (offset < -SWIPE_THRESHOLD) handleSwipe("ignored");
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      onDragEnd={handleDragEnd}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.25}
      className="relative w-96 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing
      bg-black/50 border border-green-400/20 shadow-[0_0_25px_#00ff8f50] backdrop-blur-xl 
      transition-all duration-300 hover:scale-[1.02]"
    >
      {/* SWIPE RIGHT GLOW */}
      <motion.div
        style={{ backgroundColor: rightGlow }}
        className="absolute inset-0 z-10 pointer-events-none rounded-3xl"
      ></motion.div>

      {/* SWIPE LEFT GLOW */}
      <motion.div
        style={{ backgroundColor: leftGlow }}
        className="absolute inset-0 z-10 pointer-events-none rounded-3xl"
      ></motion.div>

      {/* IMAGE AREA */}
      <figure className="relative">
        <img
          src={photoUrl}
          alt="profile"
          className="w-full h-96 object-cover object-center select-none rounded-t-3xl"
        />

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 w-full px-5 py-4 
        bg-gradient-to-t from-black/90 to-transparent">
          
          <h2 className="text-3xl font-bold tracking-wide text-white drop-shadow-[0_0_6px_#00ff8f]">
            {firstName} {lastName}
          </h2>

          {(age || gender) && (
            <p className="text-gray-300 text-sm">
              {age && `${age} yrs`} {gender && `• ${gender}`}
            </p>
          )}
        </div>
      </figure>

      {/* CARD BODY */}
      <div className="p-6 space-y-5">

        {/* ABOUT */}
        {about && (
          <p className="text-green-200/90 text-sm bg-green-400/10 border border-green-400/20 
          p-3 rounded-xl font-mono leading-relaxed shadow-[0_0_10px_#00ff8f30]">
            “{about}”
          </p>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-green-400 mb-2 tracking-wide">
              SKILLS
            </h3>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-semibold rounded-full
                  border border-green-400/40 bg-green-400/10 text-green-300
                  shadow-[0_0_8px_#00ff8f40] backdrop-blur-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={() => handleSwipe("ignored")}
            className="flex-1 py-3 rounded-full font-semibold text-red-300
            border border-red-500/40 bg-red-500/10 
            hover:bg-red-500/20 hover:shadow-[0_0_12px_#ff3b3b80] transition-all"
          >
            ❌ IGNORE
          </button>

          <button
            onClick={() => handleSwipe("interested")}
            className="flex-1 py-3 rounded-full font-semibold text-green-900
            bg-green-400 shadow-[0_0_15px_#00ff8f80]
            hover:bg-green-300 transition-all"
          >
            ❤️ INTERESTED
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
