import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constant";

const Requests = () => {
  const [requests, setRequests] = useState([]);

  // Fetch received requests
  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      setRequests(res.data.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // Accept request
  const acceptRequest = async (requestId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/accepted/${requestId}`,
        {},
        { withCredentials: true }
      );

      // Remove from UI
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  // Reject request
  const rejectRequest = async (requestId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/rejected/${requestId}`,
        {},
        { withCredentials: true }
      );

      // Remove from UI
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // -----------------------------------------------------
  // Placeholder/Empty State (Themed)
  // -----------------------------------------------------
  if (!requests || requests.length === 0)
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <h1 className="text-center text-gray-400 font-mono text-xl tracking-wider border border-green-400/30 p-6 rounded-lg shadow-[0_0_10px_#00ff8f20]">
          // STATUS: 404 - PENDING_REQUESTS_EMPTY
        </h1>
      </div>
    );

  // -----------------------------------------------------
  // Main Requests Grid
  // -----------------------------------------------------
  return (
    <div className="flex flex-col items-center my-10 w-full px-4">
      <h2 className="font-extrabold text-4xl mb-10 text-white font-mono tracking-wider drop-shadow-[0_0_6px_#00ff8f] uppercase">
        :: PENDING REQUESTS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
        {requests.map((req, index) => {
          const user = req.fromId; // requester object
          if (!user) return null; // Skip if requester data is missing

          // Use the user's ID as part of the visual theme
          const userIdDisplay = (index + 1000).toString();

          return (
            <div
              key={req._id}
              // Card Styling: Dark BG, Neon Border, Enhanced Hover Effect
              className="bg-gray-900/80 text-white rounded-xl overflow-hidden border border-green-400/20 shadow-[0_0_15px_#00ff8f30] hover:shadow-[0_0_30px_#00ff8f70] transition-all duration-300 w-full max-w-sm mx-auto font-mono"
            >
              
              {/* Photo Area */}
              <div className="w-full h-56 overflow-hidden bg-gray-800 relative border-b border-green-400/30">
                <img
                  src={user.photoUrl || "https://via.placeholder.com/400x224?text=NO+IMAGE"}
                  alt={`${user.firstName} Profile`}
                  className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-110"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
              </div>

              {/* Data Body */}
              <div className="p-5 flex flex-col gap-4">
                
                {/* Name & ID Block */}
                <div>
                    <p className="text-xs text-green-400 uppercase tracking-widest">// REQUEST_FROM:</p>
                    <p className="text-2xl font-bold text-white mt-1 drop-shadow-[0_0_3px_#00ff8f] leading-tight">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">[TEMP_ID: {userIdDisplay}]</p>
                    <hr className="my-3 border-green-400/30" />
                </div>

                {/* Metadata Block */}
                <div className="text-gray-400 text-sm">
                  <p className="text-xs text-green-400 uppercase tracking-widest">// METADATA_FIELDS:</p>
                  {user.age && <p className="mt-1">:: AGE: {user.age}</p>}
                  {user.gender && <p>:: GENDER: {user.gender.toUpperCase()}</p>}
                  <hr className="my-3 border-green-400/30" />
                </div>

                {/* About Block */}
                {user.about && (
                  <div>
                      <p className="text-xs text-green-400 uppercase tracking-widest">// ABSTRACT:</p>
                      <p className="text-gray-300 text-sm mt-1 line-clamp-3 leading-relaxed">
                        {user.about}
                      </p>
                  </div>
                )}
                
                {/* Buttons - Clear Call to Action */}
                <div className="mt-4 pt-2 border-t border-green-400/50 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => rejectRequest(req._id)}
                    // Reject button: High-contrast red/orange for danger/cancellation
                    className="py-2 rounded-md bg-red-700/80 hover:bg-red-600 text-white font-bold uppercase shadow-[0_0_10px_rgba(255,0,0,0.6)] transition-all font-mono text-sm"
                  >
                    REJECT
                  </button>

                  <button
                    onClick={() => acceptRequest(req._id)}
                    // Accept button: Primary neon green action
                    className="py-2 rounded-md bg-green-400 hover:bg-green-300 text-black font-bold uppercase shadow-[0_0_15px_#00ff8f80] transition-all font-mono text-sm"
                  >
                    ACCEPT
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;