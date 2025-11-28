import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnection = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      if (res.data && res.data.data) {
        dispatch(addConnection(res.data.data));
      }
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  useEffect(() => {
    fetchConnection();
  }, []);

  // -----------------------------------------------------
  // Empty State
  // -----------------------------------------------------
  if (!connections || connections.length === 0)
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <h1 className="text-center text-gray-400 font-mono text-xl tracking-wider border border-green-400/30 p-6 rounded-lg shadow-[0_0_10px_#00ff8f20]">
          // STATUS: 404 - CONNECTION_LOG_EMPTY. <br /> // SCANNING: Initiate match sequence?
        </h1>
      </div>
    );

  // -----------------------------------------------------
  // Main Connections Grid
  // -----------------------------------------------------
  return (
    <div className="flex flex-col items-center my-10 w-full px-4">
      <h2 className="font-extrabold text-4xl mb-10 text-white font-mono tracking-wider drop-shadow-[0_0_6px_#00ff8f] uppercase">
        :: CONNECTION LOG
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
        {connections.map((connection) => {
          const skillsArray = Array.isArray(connection.skills)
            ? connection.skills.filter((s) => s && s.trim())
            : [];

          return (
            <div
              key={connection._id}
              className="bg-gray-900/80 text-white rounded-xl overflow-hidden border border-green-400/20 shadow-[0_0_15px_#00ff8f30] hover:shadow-[0_0_30px_#00ff8f70] hover:scale-[1.02] transition-all duration-300 w-full max-w-sm mx-auto font-mono"
            >
              {/* Photo */}
              <div className="w-full h-56 overflow-hidden bg-gray-800 relative border-b border-green-400/30">
                <img
                  src={
                    connection.photoUrl ||
                    "https://via.placeholder.com/400x224?text=NO+IMAGE"
                  }
                  alt={`${connection.firstName} Profile`}
                  className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-4">
                {/* Name */}
                <div>
                  <p className="text-xs text-green-400 uppercase tracking-widest">
                    // NAME_FIELD:
                  </p>
                  <p className="text-2xl font-bold text-white mt-1 drop-shadow-[0_0_3px_#00ff8f] leading-tight">
                    {connection.firstName} {connection.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    [ID: {connection._id}]
                  </p>
                  <hr className="my-3 border-green-400/30" />
                </div>

                {/* Metadata */}
                <div className="text-gray-400 text-sm">
                  <p className="text-xs text-green-400 uppercase tracking-widest">
                    // METADATA_FIELDS:
                  </p>

                  {connection.age && <p className="mt-1">:: AGE: {connection.age}</p>}
                  {connection.gender && (
                    <p>:: GENDER: {connection.gender.toUpperCase()}</p>
                  )}

                  <hr className="my-3 border-green-400/30" />
                </div>

                {/* About */}
                {connection.about && (
                  <div>
                    <p className="text-xs text-green-400 uppercase tracking-widest">
                      // ABSTRACT:
                    </p>
                    <p className="text-gray-300 text-sm mt-1 line-clamp-3 leading-relaxed">
                      {connection.about}
                    </p>
                    <hr className="my-3 border-green-400/30" />
                  </div>
                )}

                {/* Skills */}
                {skillsArray.length > 0 && (
                  <div>
                    <h4 className="text-xs text-green-400 uppercase tracking-widest">
                      // SKILLSET_HITS (MAX 5)
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skillsArray.slice(0, 5).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded bg-gray-700/70 text-green-300 border border-green-400/50"
                        >
                          {skill.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Button */}
                <div className="mt-4 pt-2 border-t border-green-400/50">
                  <Link to={"/app/chat/" + connection._id}>
                    <button
                      className="w-full py-2 rounded-md bg-green-400 hover:bg-green-300 text-black font-bold uppercase shadow-[0_0_15px_#00ff8f80] transition-all font-mono"
                    >
                      OPEN CHAT
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
