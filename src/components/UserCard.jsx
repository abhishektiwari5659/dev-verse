import axios from "axios";
import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constant";
import { removeUserFromFeed } from "../utils/feedSlice";

const SWIPE_THRESHOLD = 120; // px threshold to trigger swipe

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
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, 0, 200], [0.3, 1, 0.3]);

  // MAIN SWIPE HANDLER
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
    if (offset > SWIPE_THRESHOLD) {
      // SWIPE RIGHT ❤️
      handleSwipe("interested");
    } else if (offset < -SWIPE_THRESHOLD) {
      // SWIPE LEFT ❌
      handleSwipe("ignored");
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      onDragEnd={handleDragEnd}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.25}
      className="card bg-gray-800 text-white w-96 shadow-2xl rounded-3xl overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >

      {/* IMAGE */}
      <figure className="relative">
        <img src={photoUrl} alt="profile" className="w-full h-64 object-cover" />

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent px-4 py-3">
          <h2 className="text-2xl font-bold">
            {firstName} {lastName}
          </h2>

          {(age || gender) && (
            <p className="text-gray-300 text-sm">
              {age ? `${age} years old` : ""} {gender ? `• ${gender}` : ""}
            </p>
          )}
        </div>
      </figure>

      {/* BODY */}
      <div className="card-body p-5 space-y-4">
        {about && (
          <p className="text-gray-300 text-sm leading-relaxed italic border-l-4 border-blue-500 pl-3">
            “{about}”
          </p>
        )}

        {skills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
              Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="badge border border-blue-400 text-blue-300 px-3 py-2 text-xs rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* BUTTONS (Fallback for non-swipe) */}
        <div className="flex justify-between items-center gap-5 mt-6">
          <button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-full"
            onClick={() => handleSwipe("ignored")}
          >
            ❌ Ignore
          </button>

          <button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-full"
            onClick={() => handleSwipe("interested")}
          >
            ❤️ Interested
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
