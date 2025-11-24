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

      console.log("Fetched requests:", res.data);

      setRequests(res.data.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  // Accept request
  const acceptRequest = async (requestId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/review/accepted/${requestId}`,
        {},
        { withCredentials: true }
      );

      console.log("Accepted:", res.data);

      // Remove from UI
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error("Error accepting request:", err);
    }
  };

  // Reject request
  const rejectRequest = async (requestId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/review/rejected/${requestId}`,
        {},
        { withCredentials: true }
      );

      console.log("Rejected:", res.data);

      // Remove from UI
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests || requests.length === 0)
    return (
      <h1 className="text-center text-gray-400 mt-10 text-xl">
        No requests received
      </h1>
    );

  return (
    <div className="flex flex-col items-center my-10 w-full">
      <h2 className="font-bold text-3xl mb-6 text-white">Requests</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {requests.map((req) => {
          const user = req.fromId; // requester

          return (
            <div
              key={req._id}
              className="bg-gray-800 text-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 w-72"
            >
              {/* Photo */}
              <div className="w-full h-56 overflow-hidden bg-gray-700">
                <img
                  src={user.photoUrl || "https://via.placeholder.com/400"}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col gap-2">
                <div className="text-xl font-semibold">
                  {user.firstName} {user.lastName}
                </div>

                {user.age && (
                  <p className="text-gray-400 text-sm">Age: {user.age}</p>
                )}
                {user.gender && (
                  <p className="text-gray-400 text-sm">
                    Gender: {user.gender}
                  </p>
                )}

                {user.about && (
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                    {user.about}
                  </p>
                )}

                {/* Buttons */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => rejectRequest(req._id)}
                    className="btn btn-sm bg-red-600 hover:bg-red-700 text-white w-full rounded-lg"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => acceptRequest(req._id)}
                    className="btn btn-sm bg-green-600 hover:bg-green-700 text-white w-full rounded-lg"
                  >
                    Accept
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
