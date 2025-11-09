import React, { useState } from "react";
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
  const [showToast, setShowToast] = useState(false); // ✅ Toast visibility

  const dispatch = useDispatch();

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, about, age, gender, skills, photoUrl },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));

      // ✅ Show toast notification for 3 seconds
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-black text-white px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl relative">
        {/* ==== LEFT: FORM ==== */}
        <div className="bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl w-full p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
              Edit Profile
            </h2>
            <p className="text-gray-400 text-sm">
              Update your details to keep your profile up to date.
            </p>
          </div>

          <form onSubmit={saveProfile} className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-gray-600 bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter your first name"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-gray-600 bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter your last name"
              />
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Age
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="18"
                  className="w-full rounded-xl border border-gray-600 bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-xl border border-gray-600 bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Photo URL
              </label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full rounded-xl border border-gray-600 bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Paste your profile photo URL"
              />
            </div>

            {/* About */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                About
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                maxLength="250"
                rows="3"
                className="w-full rounded-xl border border-gray-600 bg-gray-700 text-white px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Tell us something about yourself..."
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB"
                className="w-full rounded-xl border border-gray-600 bg-gray-700 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all hover:scale-[1.02]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* ==== RIGHT: LIVE PREVIEW ==== */}
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

        {/* ✅ DaisyUI Toast Notification */}
        {showToast && (
          <div className="toast toast-end">
            <div className="alert alert-success shadow-lg">
              <span className="text-white font-medium">
                ✅ Profile updated successfully!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
