import React from "react";

const UserCard = ({ user }) => {
  if (!user) return null;

  const { firstName, lastName, photoUrl, age, gender, about, skills } = user;

  return (
    <div className="card bg-gray-800 text-white w-96 shadow-2xl rounded-3xl overflow-hidden transform transition-all hover:scale-[1.02] duration-300">
      {/* Profile Image */}
      <figure className="relative">
        <img
          src={photoUrl}
          alt="profile"
          className="w-full h-64 object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent px-4 py-3">
          <h2 className="text-2xl font-bold">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-gray-300 text-sm">
              {age} years old • {gender}
            </p>
          )}
        </div>
      </figure>

      {/* Card Body */}
      <div className="card-body p-5 space-y-4">
        {/* About */}
        {about && (
          <p className="text-gray-300 text-sm leading-relaxed italic border-l-4 border-blue-500 pl-3">
            “{about}”
          </p>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge border border-blue-400 text-blue-300 px-3 py-2 text-xs rounded-full hover:bg-blue-500 hover:text-white transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center gap-5 mt-6">
          {/* Ignore Button */}
          <button
            className="flex-1 bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800 
            text-white font-semibold py-3 rounded-full shadow-md flex justify-center items-center gap-2 
            hover:scale-105 transition-all duration-200"
          >
            <span className="text-xl">❌</span>
            <span>Ignore</span>
          </button>

          {/* Interested Button */}
          <button
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
            text-white font-semibold py-3 rounded-full shadow-md flex justify-center items-center gap-2 
            hover:scale-105 transition-all duration-200"
          >
            <span className="text-xl">❤️</span>
            <span>Interested</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
